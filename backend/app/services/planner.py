import json
from pathlib import Path
from .calculations import compute_targets

FOOD_PATH = Path(__file__).resolve().parents[2] / "data" / "foods.json"

def load_foods():
    return json.loads(FOOD_PATH.read_text(encoding="utf-8"))

def allowed(food, profile):
    pref = profile["diet_pref"]
    if pref == "vegan" and "vegan" not in food["tags"]:
        return False
    if pref == "vegetarian" and "vegetarian" not in food["tags"]:
        return False
    allergy_text = " ".join(profile.get("allergies", [])).lower()
    if allergy_text and any(term in food["name"].lower() for term in allergy_text.split(",")):
        return False
    return True

def nutrition(food, grams):
    factor = grams / 100
    return {
        "kcal": food["per100"]["kcal"] * factor,
        "p": food["per100"]["p"] * factor,
        "c": food["per100"]["c"] * factor,
        "f": food["per100"]["f"] * factor,
    }

def choose_foods(profile, targets):
    foods = [f for f in load_foods() if allowed(f, profile)]
    if not foods:
        return []
    # Simple deterministic baseline: distribute target calories across meal slots.
    slots = [("Breakfast", 0.25), ("Lunch", 0.30), ("Snack", 0.15), ("Dinner", 0.30)]
    result = []
    for i, (slot, share) in enumerate(slots):
        food = foods[i % len(foods)]
        desired_kcal = targets["cal"] * share
        grams = max(50, min(450, desired_kcal / max(food["per100"]["kcal"], 1) * 100))
        n = nutrition(food, grams)
        result.append({
            "meal_type": slot,
            "food_id": food["id"],
            "name": food["name"],
            "grams": round(grams),
            **{k: round(v, 1) for k, v in n.items()},
            "description": f"{food['name']} portion selected as a simple {slot.lower()} example."
        })
    return result

def generate_plan(profile, days=1):
    targets = compute_targets(profile)
    all_days = []
    for day in range(days):
        meals = choose_foods(profile, targets)
        all_days.append({"day": day + 1, "meals": meals})
    return {
        "total_cal": targets["cal"],
        "macros": targets["macros"],
        "days": all_days,
        "engine": "rule-based baseline",
        "explanation": "Meals were selected from a small synthetic food catalog using dietary preference filters and a simple calorie-share heuristic. This is an educational example, not a clinically optimized diet."
    }
