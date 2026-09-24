import React from "react";
import { Utensils } from "lucide-react";

export default function MealCard({ meal }) {
  return (
    <article className="meal-card">
      <div className="meal-icon"><Utensils size={18} /></div>
      <div className="meal-main">
        <div className="eyebrow">{meal.meal_type}</div>
        <h3>{meal.name}</h3>
        <p>{meal.description}</p>
        <div className="meal-meta">
          <span>{meal.grams} g</span>
          <span>{Math.round(meal.kcal)} kcal</span>
          <span>P {meal.p}g</span>
          <span>C {meal.c}g</span>
          <span>F {meal.f}g</span>
        </div>
      </div>
    </article>
  );
}
