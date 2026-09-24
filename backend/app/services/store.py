import json, os
from pathlib import Path
from datetime import datetime, timezone
from uuid import uuid4

ROOT = Path(__file__).resolve().parents[2] / "data"
LOCAL = ROOT / "local_store.json"

def now():
    return datetime.now(timezone.utc).isoformat()

def _load():
    if not LOCAL.exists():
        return {"profiles": {}, "plans": {}, "intake": {}, "files": {}}
    return json.loads(LOCAL.read_text(encoding="utf-8"))

def _save(data):
    LOCAL.parent.mkdir(parents=True, exist_ok=True)
    LOCAL.write_text(json.dumps(data, indent=2), encoding="utf-8")

def get_profile(uid):
    if os.getenv("DATA_MODE", "local") == "local":
        return _load()["profiles"].get(uid)
    return None

def save_profile(uid, profile):
    if os.getenv("DATA_MODE", "local") == "local":
        data = _load()
        data["profiles"][uid] = {**profile, "updatedAt": now()}
        _save(data)
        return data["profiles"][uid]
    return profile

def save_plan(uid, plan):
    plan_id = str(uuid4())
    record = {"plan_id": plan_id, "user_id": uid, "created_at": now(), **plan}
    if os.getenv("DATA_MODE", "local") == "local":
        data = _load()
        data["plans"].setdefault(uid, {})[plan_id] = record
        _save(data)
    return record

def list_plans(uid):
    if os.getenv("DATA_MODE", "local") == "local":
        return list(_load()["plans"].get(uid, {}).values())
    return []

def delete_plan(uid, plan_id):
    if os.getenv("DATA_MODE", "local") == "local":
        data = _load()
        if plan_id in data["plans"].get(uid, {}):
            del data["plans"][uid][plan_id]
            _save(data)
            return True
    return False

def get_intake(uid):
    if os.getenv("DATA_MODE", "local") == "local":
        return _load()["intake"].get(uid, {"items": [], "totals": {"kcal": 0, "p": 0, "c": 0, "f": 0}})
    return {"items": [], "totals": {"kcal": 0, "p": 0, "c": 0, "f": 0}}

def add_intake(uid, item):
    if os.getenv("DATA_MODE", "local") == "local":
        data = _load()
        record = data["intake"].setdefault(uid, {"items": [], "totals": {"kcal": 0, "p": 0, "c": 0, "f": 0}})
        record["items"].append(item)
        for key in ("kcal", "p", "c", "f"):
            record["totals"][key] = round(record["totals"].get(key, 0) + item.get(key, 0), 1)
        _save(data)
        return record
    return get_intake(uid)
