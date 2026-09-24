const { onCall, onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const PAL = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };

function mifflin({ sex, weight_kg, height_cm, age }) {
  const s = sex === "male" ? 5 : -161;
  return (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + s;
}

exports.computeTargets = onCall(async (request) => {
  if (!request.auth) throw new Error("Authentication required.");
  const { sex, weight_kg, height_cm, age, activity_level, goal } = request.data;
  const bmr = mifflin({ sex, weight_kg, height_cm, age });
  const tdee = bmr * (PAL[activity_level] || 1.2);
  const delta = goal === "cut" ? -0.15 : goal === "gain" ? 0.15 : 0;
  const cal = Math.round(tdee * (1 + delta));
  const macros = {
    p: Math.round(0.30 * cal / 4),
    c: Math.round(0.40 * cal / 4),
    f: Math.round(0.30 * cal / 9)
  };
  return { bmr: Math.round(bmr), tdee: Math.round(tdee), cal, macros };
});

exports.planDay = onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST required" });
  const { macros, diet_pref } = req.body || {};
  if (!macros) return res.status(400).json({ error: "macros are required" });

  const snapshot = await db.collection("foods").limit(30).get();
  const foods = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    .filter(food => {
      if (diet_pref === "vegan") return (food.tags || []).includes("vegan");
      if (diet_pref === "vegetarian") return (food.tags || []).includes("vegetarian");
      return true;
    });

  res.json({
    plan: foods.slice(0, 5).map(food => ({
      foodId: food.id,
      name: food.name,
      targetMacros: macros
    }))
  });
});
