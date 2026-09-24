import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.api import router

load_dotenv()

app = FastAPI(
    title="NutriCloud API",
    version="1.0.0",
    description="Educational/general-wellness diet planner API"
)

origins = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE","OPTIONS"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"service":"NutriCloud API","docs":"/docs","status":"running"}
