import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Flame,
  Target,
  TrendingUp,
  ArrowRight,
  FileText,
} from "lucide-react";

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "../firebase";

import { api } from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [targets, setTargets] = useState(null);
  const [plans, setPlans] = useState([]);
  const [intake, setIntake] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      /*
       * FIREBASE CLOUD MODE
       */
      if (firebaseConfigured && auth?.currentUser && db) {
        const uid = auth.currentUser.uid;

        // -----------------------------------------
        // 1. LOAD PROFILE FROM FIRESTORE
        // -----------------------------------------
        const profileRef = doc(
          db,
          "users",
          uid,
          "profile",
          "profile"
        );

        const profileSnap = await getDoc(profileRef);

        let profileData = null;

        if (profileSnap.exists()) {
          profileData = profileSnap.data();
          setProfile(profileData);
        }

        // -----------------------------------------
        // 2. LOAD SAVED PLANS FROM FIRESTORE
        // -----------------------------------------
        const plansRef = collection(
          db,
          "users",
          uid,
          "plans"
        );

        const plansSnap = await getDocs(plansRef);

        const cloudPlans = plansSnap.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setPlans(cloudPlans);

        // -----------------------------------------
        // 3. LOAD TODAY'S INTAKE FROM FIRESTORE
        // -----------------------------------------
        const today = new Date()
          .toISOString()
          .slice(0, 10);

        const intakeRef = doc(
          db,
          "users",
          uid,
          "intake",
          today
        );

        const intakeSnap = await getDoc(intakeRef);

        if (intakeSnap.exists()) {
          setIntake(intakeSnap.data());
        } else {
          setIntake({
            totals: {
              kcal: 0,
              p: 0,
              c: 0,
              f: 0,
            },
          });
        }

        // -----------------------------------------
        // 4. CALCULATE DAILY TARGETS
        // -----------------------------------------
        if (profileData) {
          const weight = Number(
            profileData.weight_kg || 60
          );

          const height = Number(
            profileData.height_cm || 165
          );

          const age = Number(
            profileData.age || 22
          );

          const sex = String(
            profileData.sex || "female"
          ).toLowerCase();

          // Mifflin-St Jeor BMR
          let bmr;

          if (sex === "male") {
            bmr =
              (10 * weight) +
              (6.25 * height) -
              (5 * age) +
              5;
          } else {
            bmr =
              (10 * weight) +
              (6.25 * height) -
              (5 * age) -
              161;
          }

          // Activity multiplier
          const activityFactors = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9,
          };

          const activity = String(
            profileData.activity_level || "moderate"
          ).toLowerCase();

          const activityFactor =
            activityFactors[activity] || 1.55;

          // TDEE
          let calories = bmr * activityFactor;

          // -----------------------------------------
          // GOAL ADJUSTMENT
          // -----------------------------------------
          const goal = String(
            profileData.goal || "maintain"
          ).toLowerCase();

          if (
            goal.includes("loss") ||
            goal.includes("lose") ||
            goal.includes("weight-management")
          ) {
            calories -= 300;
          } else if (
            goal.includes("gain") ||
            goal.includes("fitness")
          ) {
            calories += 250;
          }

          calories = Math.round(
            Math.max(1200, calories)
          );

          // -----------------------------------------
          // MACRO DISTRIBUTION
          // -----------------------------------------
          const protein = Math.round(
            (calories * 0.30) / 4
          );

          const carbs = Math.round(
            (calories * 0.40) / 4
          );

          const fat = Math.round(
            (calories * 0.30) / 9
          );

          setTargets({
            cal: calories,
            macros: {
              p: protein,
              c: carbs,
              f: fat,
            },
          });
        }

        return;
      }

      /*
       * LOCAL DEMO MODE
       */
      const [
        profileData,
        targetData,
        plansData,
        intakeData,
      ] = await Promise.all([
        api.profile(),
        api.targets(),
        api.plans(),
        api.intake(),
      ]);

      setProfile(profileData);
      setTargets(targetData);
      setPlans(plansData.plans || []);
      setIntake(intakeData);

    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );
    }
  }

  // -----------------------------------------
  // DISPLAY VALUES
  // -----------------------------------------

  const name = profile?.name || "there";

  const calories =
    Number(intake?.totals?.kcal || 0);

  const protein =
    Number(intake?.totals?.p || 0);

  const carbs =
    Number(intake?.totals?.c || 0);

  const fat =
    Number(intake?.totals?.f || 0);

  const calorieTarget =
    Number(targets?.cal || 0);

  const proteinTarget =
    Number(targets?.macros?.p || 0);

  const carbsTarget =
    Number(targets?.macros?.c || 0);

  const fatTarget =
    Number(targets?.macros?.f || 0);

  const calorieProgress = calorieTarget
    ? Math.min(
        100,
        Math.round(
          (calories / calorieTarget) * 100
        )
      )
    : 0;

  return (
    <div className="page">

      {/* -----------------------------------------
          HEADER
      ----------------------------------------- */}

      <div className="dashboard-hero">

        <div>

          <div className="eyebrow">
            YOUR WORKSPACE
          </div>

          <h1>
            Good to see you,{" "}
            {name.split(" ")[0]}.
          </h1>

          <p>
            Your cloud-backed planning overview.
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
          STAT CARDS
      ----------------------------------------- */}

      <div className="stats-grid">

        <StatCard
          label="Daily calories"
          value={
            calorieTarget
              ? calorieTarget
              : "—"
          }
          unit=" kcal"
          icon={Flame}
        />

        <StatCard
          label="Protein target"
          value={
            proteinTarget
              ? proteinTarget
              : "—"
          }
          unit=" g"
          icon={Target}
        />

        <StatCard
          label="Saved plans"
          value={plans.length}
          unit=""
          icon={FileText}
        />

        <StatCard
          label="Intake today"
          value={calories}
          unit=" kcal"
          icon={TrendingUp}
        />

      </div>


      {/* -----------------------------------------
          DASHBOARD CONTENT
      ----------------------------------------- */}

      <div className="dashboard-grid">

        {/* TODAY'S SNAPSHOT */}

        <section className="panel">

          <div className="panel-title">

            Today's snapshot

            <span className="badge">
              Cloud analytics
            </span>

          </div>


          {/* CALORIE PROGRESS */}

          <div className="progress-wrap">

            <div className="progress-label">

              <span>
                Calorie target
              </span>

              <b>
                {calorieProgress}%
              </b>

            </div>

            <div className="progress">

              <div
                style={{
                  width: `${calorieProgress}%`,
                }}
              />

            </div>

          </div>


          {/* MACROS */}

          <div className="macro-bars">

            <Macro
              label="Protein"
              value={protein}
              target={proteinTarget || 1}
            />

            <Macro
              label="Carbs"
              value={carbs}
              target={carbsTarget || 1}
            />

            <Macro
              label="Fat"
              value={fat}
              target={fatTarget || 1}
            />

          </div>

        </section>


        {/* QUICK ACTIONS */}

        <section className="panel">

          <div className="panel-title">
            Quick actions
          </div>

          <Link
            className="action-row"
            to="/profile"
          >
            <span>
              Update profile
            </span>

            <ArrowRight size={17} />

          </Link>


          <Link
            className="action-row"
            to="/generate"
          >
            <span>
              Create meal plan
            </span>

            <ArrowRight size={17} />

          </Link>


          <Link
            className="action-row"
            to="/plans"
          >
            <span>
              Open saved plans
            </span>

            <ArrowRight size={17} />

          </Link>


          <Link
            className="action-row"
            to="/intake"
          >
            <span>
              Track today's intake
            </span>

            <ArrowRight size={17} />

          </Link>

        </section>

      </div>


      {/* -----------------------------------------
          DISCLAIMER
      ----------------------------------------- */}

      <div className="disclaimer">

        This dashboard uses
        synthetic/demo-friendly wellness data.
        Estimates are not medical advice.

      </div>

    </div>
  );
}


/* -----------------------------------------
   MACRO PROGRESS COMPONENT
----------------------------------------- */

function Macro({
  label,
  value,
  target,
}) {

  const safeTarget =
    Number(target) || 1;

  const percentage = Math.min(
    100,
    (Number(value || 0) /
      safeTarget) *
      100
  );

  return (

    <div className="macro-row">

      <div>

        <span>
          {label}
        </span>

        <b>
          {Math.round(
            Number(value || 0)
          )}
          g /{" "}
          {Math.round(
            safeTarget
          )}
          g
        </b>

      </div>


      <div className="progress thin">

        <div
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>

  );
}