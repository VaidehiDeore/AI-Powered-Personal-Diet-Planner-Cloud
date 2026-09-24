import React, { useState } from "react";
import { api } from "../services/api";
import { auth, db, firebaseConfigured } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { Sparkles, RefreshCw, Cloud } from "lucide-react";
import MealCard from "../components/MealCard";

export default function GeneratePlan() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await api.generatePlan({ days: 1 });
      setPlan(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function savePlan() {
    if (!plan) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!firebaseConfigured || !auth?.currentUser || !db) {
        throw new Error("Firebase is not configured or you are not signed in.");
      }

      const userId = auth.currentUser.uid;
      const planId =
        plan.plan_id ||
        (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`);

      const planRef = doc(db, "users", userId, "plans", planId);

      await setDoc(planRef, {
        ...plan,
        plan_id: planId,
        created_at: new Date().toISOString(),
        saved_to: "firebase_firestore",
      });

      setMessage("Plan saved successfully to Firebase Cloud Firestore.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">AI ASSISTANT</div>
          <h1>Generate a plan</h1>
          <p>
            Create a structured meal-plan example using your saved profile and
            food catalog.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={generate}
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw className="spin" size={17} />
              Building...
            </>
          ) : (
            <>
              <Sparkles size={17} />
              Generate plan
            </>
          )}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {message && <div className="success-box">{message}</div>}

      {!plan && !loading && (
        <div className="empty-state">
          <div className="empty-icon">
            <Sparkles />
          </div>

          <h2>Your next plan starts here</h2>

          <p>
            Save your profile first, then generate a personalized educational
            example.
          </p>

          <button className="secondary-button" onClick={generate}>
            Generate now
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-card">
          Analyzing profile preferences and assembling meals...
        </div>
      )}

      {plan && (
        <div className="plan-result">
          <div className="target-banner">
            <div>
              <span>Daily target estimate</span>
              <strong>{plan.total_cal} kcal</strong>
            </div>

            <div>
              <span>Protein</span>
              <strong>{plan.macros?.p} g</strong>
            </div>

            <div>
              <span>Carbs</span>
              <strong>{plan.macros?.c} g</strong>
            </div>

            <div>
              <span>Fat</span>
              <strong>{plan.macros?.f} g</strong>
            </div>
          </div>

          <div className="meal-list">
            {plan.days?.[0]?.meals?.map((meal, i) => (
              <MealCard meal={meal} key={i} />
            ))}
          </div>

          <div className="panel">
            <div className="eyebrow">PLAN ACTIONS</div>

            <div className="form-actions">
              <div>
                <h3>Save this plan</h3>
                <p className="muted">
                  Store this plan securely in your Firebase Cloud Firestore
                  workspace.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={savePlan}
                disabled={saving}
              >
                <Cloud size={17} />
                {saving ? "Saving..." : "Save to cloud"}
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="eyebrow">WHY THESE MEALS?</div>

            <p>{plan.explanation}</p>

            <div className="disclaimer">
              Generated as a general educational/wellness example. Values are
              estimates and should not be treated as medical advice.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
