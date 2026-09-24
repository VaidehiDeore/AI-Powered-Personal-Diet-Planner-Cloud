from app.services.calculations import compute_targets
from app.services.planner import generate_plan

PROFILE = {
    "name":"Demo",
    "age":22,
    "sex":"female",
    "height_cm":165,
    "weight_kg":62,
    "activity_level":"moderate",
    "goal":"maintain",
    "diet_pref":"vegetarian",
    "allergies":[],
    "cuisines":["Indian"],
    "budget_per_day":300,
    "timeline_weeks":8
}

def test_targets_are_positive():
    result = compute_targets(PROFILE)
    assert result["bmr"] > 0
    assert result["tdee"] > result["bmr"]
    assert result["cal"] > 0
    assert result["macros"]["p"] > 0

def test_vegetarian_plan_filters_nonveg():
    plan = generate_plan(PROFILE, 1)
    names = [m["name"] for m in plan["days"][0]["meals"]]
    assert "Egg" not in names
    assert "Cooked chicken breast" not in names

def test_vegan_plan_filters_dairy_and_eggs():
    vegan = {**PROFILE, "diet_pref":"vegan"}
    plan = generate_plan(vegan, 1)
    names = [m["name"] for m in plan["days"][0]["meals"]]
    assert "Paneer" not in names
    assert "Plain curd" not in names
    assert "Egg" not in names

def test_plan_has_four_meal_slots():
    plan = generate_plan(PROFILE, 1)
    assert len(plan["days"][0]["meals"]) == 4
