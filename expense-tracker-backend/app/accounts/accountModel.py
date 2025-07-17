from pydantic import BaseModel,Field 
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

class account(BaseModel):
    _id:str
    user_id: str
    name: str
    balance: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
class Config:
    json_encoders = {
        ObjectId: str  # Automatically convert ObjectId to string
    }
    
class AccountResponse(BaseModel):
    msg: str
    accounts: List[account]
