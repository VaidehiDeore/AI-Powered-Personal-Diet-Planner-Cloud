import os
os.environ["DATA_MODE"] = "local"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_profile_save_and_targets():
    profile = {
        "name":"Demo Tester","age":22,"sex":"female","height_cm":165,"weight_kg":62,
        "activity_level":"moderate","goal":"maintain","diet_pref":"vegetarian",
        "allergies":[],"cuisines":["Indian"],"budget_per_day":300,"timeline_weeks":8
    }
    saved = client.put("/api/profile", json=profile)
    assert saved.status_code == 200
    target = client.get("/api/targets")
    assert target.status_code == 200
    assert target.json()["cal"] > 0

def test_generate_plan():
    response = client.post("/api/generate-plan", json={"days":1})
    assert response.status_code == 200
    body = response.json()
    assert body["days"][0]["meals"]
