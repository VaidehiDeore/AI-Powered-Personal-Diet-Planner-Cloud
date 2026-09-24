import React, { useEffect, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "../firebase";
import { api } from "../services/api";
import { Save, UserRound } from "lucide-react";

const initial = {
  name: "",
  age: 22,
  sex: "female",
  height_cm: 165,
  weight_kg: 62,
  activity_level: "moderate",
  goal: "maintain",
  diet_pref: "vegetarian",
  allergies: [],
  cuisines: [],
  budget_per_day: 300,
  timeline_weeks: 8
};

export default function Profile() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        if (firebaseConfigured && auth?.currentUser && db) {
          const uid = auth.currentUser.uid;
          const profileRef = doc(db, "users", uid, "profile", "profile");
          const snapshot = await getDoc(profileRef);

          if (snapshot.exists()) {
            setForm({ ...initial, ...snapshot.data() });
            setLoading(false);
            return;
          }
        }

        // Temporary local API fallback during the cloud migration.
        const data = await api.profile();
        setForm({ ...initial, ...data });
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function update(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function save(e) {
    e.preventDefault();
    setStatus("");

    try {
      if (firebaseConfigured && auth?.currentUser && db) {
        const uid = auth.currentUser.uid;

        const profileRef = doc(
          db,
          "users",
          uid,
          "profile",
          "profile"
        );

        await setDoc(
          profileRef,
          {
            ...form,
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      }

      // Keep the existing local backend synchronized temporarily.
      // This allows Generate Plan to continue working while
      // we migrate the remaining features to Firebase.
      try {
        await api.saveProfile(form);
      } catch (apiError) {
        console.warn("Local API profile sync skipped:", apiError);
      }

      setStatus("Profile saved successfully to Firebase Cloud Firestore.");
    } catch (error) {
      console.error("Firestore profile save error:", error);
      setStatus(error.message || "Could not save profile.");
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-card">Loading profile…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">PERSONALIZATION</div>
          <h1>Your profile</h1>
          <p>These inputs shape the educational meal-plan examples.</p>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={save}>
        <div className="section-title">
          <UserRound size={18} />
          <span>Basics</span>
        </div>

        <label>
          Name
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            min="13"
            max="100"
            value={form.age}
            onChange={(e) => update("age", Number(e.target.value))}
          />
        </label>

        <label>
          Sex
          <select
            value={form.sex}
            onChange={(e) => update("sex", e.target.value)}
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </label>

        <label>
          Height (cm)
          <input
            type="number"
            min="100"
            max="250"
            value={form.height_cm}
            onChange={(e) => update("height_cm", Number(e.target.value))}
          />
        </label>

        <label>
          Weight (kg)
          <input
            type="number"
            min="25"
            max="300"
            value={form.weight_kg}
            onChange={(e) => update("weight_kg", Number(e.target.value))}
          />
        </label>

        <label>
          Activity
          <select
            value={form.activity_level}
            onChange={(e) => update("activity_level", e.target.value)}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
          </select>
        </label>

        <label>
          Goal
          <select
            value={form.goal}
            onChange={(e) => update("goal", e.target.value)}
          >
            <option value="maintain">Balanced / maintain</option>
            <option value="cut">Weight-management demo</option>
            <option value="gain">Fitness-oriented gain demo</option>
          </select>
        </label>

        <label>
          Diet preference
          <select
            value={form.diet_pref}
            onChange={(e) => update("diet_pref", e.target.value)}
          >
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="omnivore">General / non-vegetarian</option>
          </select>
        </label>

        <label>
          Budget per day
          <input
            type="number"
            min="0"
            value={form.budget_per_day}
            onChange={(e) =>
              update("budget_per_day", Number(e.target.value))
            }
          />
        </label>

        <label>
          Timeline (weeks)
          <input
            type="number"
            min="1"
            max="52"
            value={form.timeline_weeks}
            onChange={(e) =>
              update("timeline_weeks", Number(e.target.value))
            }
          />
        </label>

        <label className="wide">
          Allergies / avoid (comma separated)
          <input
            value={(form.allergies || []).join(", ")}
            onChange={(e) =>
              update(
                "allergies",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
            placeholder="nuts, lactose"
          />
        </label>

        <label className="wide">
          Cuisine preferences (comma separated)
          <input
            value={(form.cuisines || []).join(", ")}
            onChange={(e) =>
              update(
                "cuisines",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean)
              )
            }
            placeholder="Indian, South Indian"
          />
        </label>

        <div className="wide form-actions">
          <span
            className={
              status.includes("successfully")
                ? "success-text"
                : "muted"
            }
          >
            {status}
          </span>

          <button className="primary-button" type="submit">
            <Save size={17} />
            Save profile
          </button>
        </div>

        <div className="wide disclaimer">
          General educational estimate only. For medical, allergy,
          eating-disorder, pregnancy, or other clinical needs, consult
          an appropriately qualified professional.
        </div>
      </form>
    </div>
  );
}
