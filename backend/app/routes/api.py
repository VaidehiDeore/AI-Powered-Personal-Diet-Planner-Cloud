import os, json
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from ..auth import current_user
from ..models.schemas import Profile, PlanRequest, IntakeItem
from ..services import store
from ..services.calculations import compute_targets
from ..services.planner import generate_plan, load_foods, nutrition

router = APIRouter(prefix="/api")
UPLOAD_ROOT = Path(__file__).resolve().parents[2] / "uploads"
ALLOWED = {"image/png","image/jpeg","image/webp","text/plain","application/pdf"}
MAX_MB = int(os.getenv("MAX_UPLOAD_MB", "5"))

@router.get("/health")
def health():
    return {"status":"ok","service":"diet-planner-api"}

def get_profile_or_404(uid):
    profile = store.get_profile(uid)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Create your profile first.")
    return profile

@router.get("/profile")
def profile(user=Depends(current_user)):
    return store.get_profile(user["uid"]) or {}

@router.put("/profile")
def save_profile(profile: Profile, user=Depends(current_user)):
    return store.save_profile(user["uid"], profile.model_dump())

@router.get("/targets")
def targets(user=Depends(current_user)):
    return compute_targets(get_profile_or_404(user["uid"]))

@router.post("/generate-plan")
def plan(request: PlanRequest, user=Depends(current_user)):
    profile = get_profile_or_404(user["uid"])
    generated = generate_plan(profile, request.days)
    return store.save_plan(user["uid"], generated)

@router.get("/plans")
def plans(user=Depends(current_user)):
    return {"plans": store.list_plans(user["uid"])}

@router.get("/plans/{plan_id}")
def plan_detail(plan_id: str, user=Depends(current_user)):
    plans = store.list_plans(user["uid"])
    for p in plans:
        if p["plan_id"] == plan_id:
            return p
    raise HTTPException(status_code=404, detail="Plan not found.")

@router.delete("/plans/{plan_id}")
def delete_plan(plan_id: str, user=Depends(current_user)):
    if not store.delete_plan(user["uid"], plan_id):
        raise HTTPException(status_code=404, detail="Plan not found.")
    return {"success": True}

@router.get("/intake")
def intake(user=Depends(current_user)):
    return store.get_intake(user["uid"])

@router.post("/intake")
def add_intake(item: IntakeItem, user=Depends(current_user)):
    food = next((f for f in load_foods() if f["id"] == item.food_id), None)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found.")
    n = nutrition(food, item.grams)
    return store.add_intake(user["uid"], {"food_id": item.food_id, "grams": item.grams, **n})

@router.post("/files")
async def upload(file: UploadFile = File(...), user=Depends(current_user)):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Unsupported file type.")
    content = await file.read()
    if len(content) > MAX_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds {MAX_MB} MB limit.")
    # Local mode stores files under a user-specific directory.
    user_dir = UPLOAD_ROOT / user["uid"]
    user_dir.mkdir(parents=True, exist_ok=True)
    safe_name = Path(file.filename or "upload.bin").name
    path = user_dir / safe_name
    path.write_bytes(content)
    return {"file_id": safe_name, "filename": safe_name, "size": len(content), "download_url": None}

@router.get("/files")
def files(user=Depends(current_user)):
    user_dir = UPLOAD_ROOT / user["uid"]
    if not user_dir.exists():
        return {"files":[]}
    return {"files":[{"file_id":p.name,"filename":p.name,"size":p.stat().st_size,"download_url":None} for p in user_dir.iterdir() if p.is_file()]}

@router.delete("/files/{file_id}")
def delete_file(file_id: str, user=Depends(current_user)):
    path = UPLOAD_ROOT / user["uid"] / Path(file_id).name
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found.")
    path.unlink()
    return {"success":True}
