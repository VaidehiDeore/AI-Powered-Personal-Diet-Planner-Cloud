PAL = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55, "active": 1.725}

def mifflin(profile):
    # Educational estimate based on the Mifflin-St Jeor equation.
    s = 5 if profile["sex"] == "male" else -161
    return (10 * profile["weight_kg"]) + (6.25 * profile["height_cm"]) - (5 * profile["age"]) + s

def compute_targets(profile):
    bmr = mifflin(profile)
    tdee = bmr * PAL.get(profile["activity_level"], 1.2)
    delta = {"cut": -0.15, "gain": 0.15, "maintain": 0}.get(profile["goal"], 0)
    cal = round(tdee * (1 + delta))
    macros = {
        "p": round(0.30 * cal / 4),
        "c": round(0.40 * cal / 4),
        "f": round(0.30 * cal / 9),
    }
    return {"bmr": round(bmr), "tdee": round(tdee), "cal": cal, "macros": macros}
