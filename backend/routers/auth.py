from fastapi import APIRouter, Depends, HTTPException
from models.user import UserUpdate, UserResponse
from utils.auth import get_current_user, get_password_hash
from utils.database import get_db
from motor.motor_asyncio import AsyncIOMotorDatabase
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/me", response_model=UserResponse)
async def get_user(current_user=Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    """Fetch current user's details from MongoDB."""
    user = await db.users.find_one({"username": current_user["username"]})
    if not user:
        logger.warning(f"User not found: {current_user['username']}")
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"User details fetched: {current_user['username']}")
    return {"username": user["username"], "email": user.get("email")}

@router.put("/me", response_model=UserResponse)
async def update_user(
    update: UserUpdate,
    current_user=Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update current user's details in MongoDB."""
    update_data = update.dict(exclude_unset=True)
    if update_data.get("password"):
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    if update_data:
        await db.users.update_one(
            {"username": current_user["username"]},
            {"$set": update_data}
        )
    
    updated_user = await db.users.find_one({"username": current_user["username"]})
    if not updated_user:
        logger.warning(f"User not found after update: {current_user['username']}")
        raise HTTPException(status_code=404, detail="User not found")
    
    logger.info(f"User updated: {current_user['username']}")
    return {"username": updated_user["username"], "email": updated_user.get("email")}