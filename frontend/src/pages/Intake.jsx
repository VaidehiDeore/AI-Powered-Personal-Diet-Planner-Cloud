import React, { useEffect, useMemo, useState } from "react";
import { auth, db, firebaseConfigured } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  Utensils,
  Plus,
  Flame,
  Target,
  Wheat,
  Droplets
} from "lucide-react";

const foods = [
  { id: "oats", name: "Oats", kcal: 3.79, p: 0.13, c: 0.68, f: 0.07 },
  { id: "banana", name: "Banana", kcal: 0.89, p: 0.011, c: 0.228, f: 0.003 },
  { id: "soy_milk", name: "Soy milk", kcal: 0.33, p: 0.033, c: 0.018, f: 0.018 },
  { id: "paneer", name: "Paneer", kcal: 2.65, p: 0.18, c: 0.02, f: 0.20 },
  { id: "tofu", name: "Tofu", kcal: 0.76, p: 0.08, c: 0.019, f: 0.048 },
  { id: "dal", name: "Cooked dal", kcal: 1.16, p: 0.09, c: 0.20, f: 0.004 },
  { id: "rice", name: "Cooked rice", kcal: 1.30, p: 0.027, c: 0.28, f: 0.003 },
  { id: "roti", name: "Whole wheat roti", kcal: 2.97, p: 0.10, c: 0.50, f: 0.07 },
  { id: "chickpeas", name: "Cooked chickpeas", kcal: 1.64, p: 0.089, c: 0.27, f: 0.026 },
  { id: "egg", name: "Egg", kcal: 1.43, p: 0.126, c: 0.007, f: 0.095 },
  { id: "chicken", name: "Cooked chicken breast", kcal: 1.65, p: 0.31, c: 0, f: 0.036 },
  { id: "apple", name: "Apple", kcal: 0.52, p: 0.003, c: 0.138, f: 0.002 },
  { id: "curd", name: "Plain curd", kcal: 0.61, p: 0.035, c: 0.047, f: 0.033 },
  { id: "peanut", name: "Peanuts", kcal: 5.67, p: 0.26, c: 0.16, f: 0.49 }
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function emptyIntake() {
  return {
    items: [],
    totals: { kcal: 0, p: 0, c: 0, f: 0 }
  };
}

export default function Intake() {
  const [intake, setIntake] = useState(emptyIntake());
  const [targets, setTargets] = useState(null);
  const [foodId, setFoodId] = useState("oats");
  const [grams, setGrams] = useState(100);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      if (!firebaseConfigured || !auth?.currentUser || !db) {
        throw new Error("Firebase is not configured or you are not signed in.");
      }

      const uid = auth.currentUser.uid;
      const date = todayKey();

      const intakeRef = doc(
        db,
        "users",
        uid,
        "intake",
        date
      );

      const snapshot = await getDoc(intakeRef);

      if (snapshot.exists()) {
        setIntake(snapshot.data());
      } else {
        setIntake(emptyIntake());
      }

      // Targets are still calculated by the existing backend.
      const token = await auth.currentUser.getIdToken();

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"}/targets`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setTargets(await response.json());
      }
    } catch (err) {
      setError(err.message || "Unable to load intake data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAdd(event) {
    event.preventDefault();

    const amount = Number(grams);

    if (!amount || amount <= 0) {
      setError("Please enter a valid quantity greater than 0 grams.");
      return;
    }

    try {
      setAdding(true);
      setError("");
      setMessage("");

      const food = foods.find((item) => item.id === foodId);

      if (!food) {
        throw new Error("Food not found.");
      }

      const item = {
        food_id: food.id,
        grams: amount,
        kcal: Number((food.kcal * amount).toFixed(1)),
        p: Number((food.p * amount).toFixed(1)),
        c: Number((food.c * amount).toFixed(1)),
        f: Number((food.f * amount).toFixed(1))
      };

      const current = intake || emptyIntake();

      const updated = {
        items: [...(current.items || []), item],
        totals: {
          kcal: Number(
            ((current.totals?.kcal || 0) + item.kcal).toFixed(1)
          ),
          p: Number(
            ((current.totals?.p || 0) + item.p).toFixed(1)
          ),
          c: Number(
            ((current.totals?.c || 0) + item.c).toFixed(1)
          ),
          f: Number(
            ((current.totals?.f || 0) + item.f).toFixed(1)
          )
        },
        updatedAt: new Date().toISOString()
      };

      const uid = auth.currentUser.uid;
      const date = todayKey();

      await setDoc(
        doc(db, "users", uid, "intake", date),
        {
          ...updated,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      setIntake(updated);
      setMessage("Food added to today's intake in Firebase.");
      setGrams(100);
    } catch (err) {
      setError(err.message || "Unable to add food.");
    } finally {
      setAdding(false);
    }
  }

  const totals = intake?.totals || {
    kcal: 0,
    p: 0,
    c: 0,
    f: 0
  };

  const caloriePercent = targets?.cal
    ? Math.min(100, Math.round((totals.kcal / targets.cal) * 100))
    : 0;

  const proteinPercent = targets?.macros?.p
    ? Math.min(100, Math.round((totals.p / targets.macros.p) * 100))
    : 0;

  const carbsPercent = targets?.macros?.c
    ? Math.min(100, Math.round((totals.c / targets.macros.c) * 100))
    : 0;

  const fatPercent = targets?.macros?.f
    ? Math.min(100, Math.round((totals.f / targets.macros.f) * 100))
    : 0;

  const foodName = useMemo(
    () => foods.find((food) => food.id === foodId)?.name || foodId,
    [foodId]
  );

  if (loading) {
    return (
      <div className="page">
        <div className="loading-card">
          Loading your intake...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">DAILY TRACKING</div>
          <h1>Today's intake</h1>
          <p>
            Log demo food entries and compare them with your estimated targets.
          </p>
        </div>

        <div className="badge">
          {intake?.items?.length || 0} entries
        </div>
      </div>

      {message && (
        <div className="success-box" style={{ marginBottom: 15 }}>
          {message}
        </div>
      )}

      {error && (
        <div className="error-box" style={{ marginBottom: 15 }}>
          {error}
        </div>
      )}

      <div className="target-banner">
        <div>
          <span>Calories consumed</span>
          <strong>{Math.round(totals.kcal)} kcal</strong>
        </div>

        <div>
          <span>Protein</span>
          <strong>{Math.round(totals.p)} g</strong>
        </div>

        <div>
          <span>Carbs</span>
          <strong>{Math.round(totals.c)} g</strong>
        </div>

        <div>
          <span>Fat</span>
          <strong>{Math.round(totals.f)} g</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-title">
            <Plus size={18} />
            Add food
          </div>

          <form onSubmit={handleAdd} className="form-grid">
            <label>
              Food
              <select
                value={foodId}
                onChange={(event) => setFoodId(event.target.value)}
              >
                {foods.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantity (grams)
              <input
                type="number"
                min="1"
                max="2000"
                value={grams}
                onChange={(event) => setGrams(event.target.value)}
              />
            </label>

            <div className="form-actions wide">
              <span className="muted">
                Adding: {foodName} — {grams || 0} g
              </span>

              <button
                className="primary-button"
                type="submit"
                disabled={adding}
              >
                <Plus size={17} />
                {adding ? "Adding..." : "Add to intake"}
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Target size={18} />
            Target progress
          </div>

          <ProgressRow
            icon={<Flame size={16} />}
            label="Calories"
            value={totals.kcal}
            target={targets?.cal || 0}
            percent={caloriePercent}
            unit="kcal"
          />

          <ProgressRow
            icon={<Wheat size={16} />}
            label="Protein"
            value={totals.p}
            target={targets?.macros?.p || 0}
            percent={proteinPercent}
            unit="g"
          />

          <ProgressRow
            icon={<Utensils size={16} />}
            label="Carbs"
            value={totals.c}
            target={targets?.macros?.c || 0}
            percent={carbsPercent}
            unit="g"
          />

          <ProgressRow
            icon={<Droplets size={16} />}
            label="Fat"
            value={totals.f}
            target={targets?.macros?.f || 0}
            percent={fatPercent}
            unit="g"
          />
        </section>
      </div>

      <section className="panel" style={{ marginTop: 15 }}>
        <div className="panel-title">
          <Utensils size={18} />
          Intake entries
        </div>

        {intake?.items?.length ? (
          <div>
            {intake.items.map((item, index) => {
              const name =
                foods.find((food) => food.id === item.food_id)?.name ||
                item.food_id;

              return (
                <div
                  className="list-row"
                  key={`${item.food_id}-${index}`}
                >
                  <div>
                    <strong>{name}</strong>
                    <span>{item.grams} g</span>
                  </div>

                  <div>
                    <b>{Math.round(item.kcal)} kcal</b>
                    <span>{Math.round(item.p)}g protein</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="muted-box">
            No food has been added yet. Use the form above to record your first
            demo intake entry.
          </div>
        )}
      </section>

      <div className="disclaimer">
        This tracker uses synthetic/demo-friendly wellness data. Nutrition
        estimates are educational examples and are not medical advice.
      </div>
    </div>
  );
}

function ProgressRow({ icon, label, value, target, percent, unit }) {
  return (
    <div className="macro-row" style={{ marginBottom: 18 }}>
      <div>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {icon}
          {label}
        </span>

        <b>
          {Math.round(value)} {unit} / {Math.round(target)} {unit}
        </b>
      </div>

      <div className="progress">
        <div style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
