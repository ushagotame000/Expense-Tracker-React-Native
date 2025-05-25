from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId

class TransactionCreate(BaseModel):
    description: str
    amount: float
    currency: str = "NPR"
    date: Optional[datetime] = None

class TransactionUpdate(BaseModel):
    description: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None
    category: Optional[str] = None
    date: Optional[datetime] = None

class TransactionResponse(BaseModel):
    id: str
    description: str
    amount: float
    currency: str
    category: str
    date: datetime
    user_id: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SpendingSummary(BaseModel):
    category: str
    total_amount: float