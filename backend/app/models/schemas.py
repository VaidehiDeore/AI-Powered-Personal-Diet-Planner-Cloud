from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

class Profile(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    age: int = Field(ge=13, le=100)
    sex: str = Field(pattern="^(male|female)$")
    height_cm: float = Field(gt=100, lt=250)
    weight_kg: float = Field(gt=25, lt=300)
    activity_level: str = Field(pattern="^(sedentary|light|moderate|active)$")
    goal: str = Field(pattern="^(maintain|cut|gain)$")
    diet_pref: str = Field(pattern="^(vegetarian|vegan|omnivore)$")
    allergies: List[str] = []
    cuisines: List[str] = []
    budget_per_day: float = Field(ge=0, le=100000)
    timeline_weeks: int = Field(ge=1, le=52)

class PlanRequest(BaseModel):
    days: int = Field(default=1, ge=1, le=7)

class IntakeItem(BaseModel):
    food_id: str
    grams: float = Field(gt=0, le=2000)

class TargetResponse(BaseModel):
    bmr: int
    tdee: int
    cal: int
    macros: dict

class ErrorResponse(BaseModel):
    success: bool = False
    error: dict
