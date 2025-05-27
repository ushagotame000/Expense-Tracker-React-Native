from fastapi import APIRouter, HTTPException
from app.models.user import User
from app.db.database import db

router = APIRouter()

@router.post("/register")
def register(user: User):
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    db.users.insert_one(user.dict())
    return {"msg": "User registered"}
