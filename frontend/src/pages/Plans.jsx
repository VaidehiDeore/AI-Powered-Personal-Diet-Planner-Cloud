import React, { useEffect, useState } from "react";
import { auth, db, firebaseConfigured } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import {
  Trash2,
  FileUp,
  Cloud,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPlans() {
    if (!firebaseConfigured || !auth?.currentUser || !db) {
      setPlans([]);
      setLoading(false);
      return;
    }

    const userId = auth.currentUser.uid;

    const plansRef = collection(
      db,
      "users",
      userId,
      "plans"
    );

    const snapshot = await getDocs(plansRef);

    const cloudPlans = snapshot.docs
      .map((item) => ({
        ...item.data(),
        plan_id: item.id,
      }))
      .sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

    setPlans(cloudPlans);
    setLoading(false);
  }

  useEffect(() => {
    loadPlans().catch((error) => {
      console.error("Failed to load plans:", error);
      setMessage("Unable to load cloud plans.");
      setLoading(false);
    });
  }, []);

  async function removePlan(id) {
    try {
      if (
        !firebaseConfigured ||
        !auth?.currentUser ||
        !db
      ) {
        throw new Error(
          "Firebase is not configured or you are not signed in."
        );
      }

      const userId = auth.currentUser.uid;

      await deleteDoc(
        doc(
          db,
          "users",
          userId,
          "plans",
          id
        )
      );

      setMessage(
        "Plan deleted from Firebase Cloud Firestore."
      );

      await loadPlans();
    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "Unable to delete plan."
      );
    }
  }

  return (
    <div className="page">

      {/* -----------------------------------------
          PAGE HEADER
      ----------------------------------------- */}

      <div className="page-heading">

        <div>

          <div className="eyebrow">
            CLOUD WORKSPACE
          </div>

          <h1>
            Saved plans
          </h1>

          <p>
            Your personalized meal plans are securely
            stored in Firebase Cloud Firestore.
          </p>

        </div>

        <Link
          to="/generate"
          className="primary-button"
        >
          <Sparkles size={17} />
          Generate plan
        </Link>

      </div>


      {/* -----------------------------------------
          MESSAGE
      ----------------------------------------- */}

      {message && (
        <div className="success-box">
          {message}
        </div>
      )}


      {/* -----------------------------------------
          SAVED PLANS
      ----------------------------------------- */}

      <section className="panel">

        <div className="panel-title">

          <Cloud size={18} />

          Saved plans

        </div>


        {loading ? (

          <div className="loading-card">
            Loading cloud plans...
          </div>

        ) : !plans.length ? (

          <div className="muted-box">

            No plans saved yet.

            <br />

            Generate a meal plan and choose
            <strong> Save to cloud</strong>.

          </div>

        ) : (

          plans.map((plan) => (

            <div
              className="list-row"
              key={plan.plan_id}
            >

              <div>

                <strong>
                  Plan #{plan.plan_id.slice(0, 8)}
                </strong>

                <span>
                  {plan.created_at
                    ? new Date(
                        plan.created_at
                      ).toLocaleString()
                    : "Saved plan"}
                </span>

              </div>


              <div>

                <b>
                  {plan.total_cal || 0} kcal
                </b>

                <button
                  className="icon-button danger"
                  onClick={() =>
                    removePlan(plan.plan_id)
                  }
                  title="Delete plan"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))

        )}

      </section>


      {/* -----------------------------------------
          CLOUD STORAGE STATUS
      ----------------------------------------- */}

      <section className="panel cloud-storage-note">

        <div className="panel-title">

          <FileUp size={18} />

          Cloud file storage

        </div>

        <div className="muted-box">

          <strong>
            File storage is not enabled in the current
            project configuration.
          </strong>

          <p>
            Your meal plans and daily nutrition data
            are already stored in Firebase Cloud Firestore.
            File upload storage can be added later if
            required.
          </p>

        </div>

      </section>


      <div className="disclaimer">

        Your saved plans are linked to your authenticated
        Firebase account. Only your account can access
        its Firestore data.

      </div>

    </div>
  );
}