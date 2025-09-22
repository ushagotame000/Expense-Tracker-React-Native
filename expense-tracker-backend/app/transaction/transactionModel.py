from pydantic import BaseModel,Field
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

class Transaction(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    description: str
    amount: float
    category: str
    type: str
    user_id: str
    account_id: Optional[str] = None
    date: datetime =  Field(default_factory=datetime.now)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        populate_by_name = True 
        json_encoders = {
            ObjectId: str  # Automatically convert ObjectId to string
        }
        arbitrary_types_allowed = True 
class TransactionCreate(BaseModel):
    description: str
    amount: float
    user_id: str
    type:str
    account_id: str
    date:str
    time:str

class TransactionResponse(BaseModel):
    msg: str
    transactions: List[Transaction]

class SingleTransactionResponse(BaseModel):
    msg: str
    transaction: Transaction