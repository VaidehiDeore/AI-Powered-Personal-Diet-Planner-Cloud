import os
from fastapi import Header, HTTPException

try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth
except Exception:
    firebase_admin = None
    firebase_auth = None

_initialized = False

def _init_firebase():
    global _initialized
    if _initialized or not firebase_admin:
        return
    if not firebase_admin._apps:
        # Uses GOOGLE_APPLICATION_CREDENTIALS or the host's default service account.
        firebase_admin.initialize_app()
    _initialized = True

def current_user(authorization: str | None = Header(default=None)):
    mode = os.getenv("DATA_MODE", "local").lower()
    if mode == "local":
        return {"uid": "demo-user", "email": "demo@example.com", "local": True}

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required.")

    token = authorization.split(" ", 1)[1]
    try:
        _init_firebase()
        decoded = firebase_auth.verify_id_token(token)
        return {"uid": decoded["uid"], "email": decoded.get("email")}
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid authentication token.") from exc
