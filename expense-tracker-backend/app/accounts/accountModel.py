from pydantic import BaseModel
from bson import ObjectId
from typing import List, Optional

class account(BaseModel):
    user_id: str
    name: str
    balance: float
    
class Config:
    json_encoders = {
        ObjectId: str  # Automatically convert ObjectId to string
    }
    
class AccountResponse(BaseModel):
    msg: str
    accounts: List[account]