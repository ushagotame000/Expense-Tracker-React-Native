from pydantic import BaseModel,Field 
from bson import ObjectId
from typing import List, Optional
from datetime import datetime
from ..transaction.transactionModel import Transaction
class Account(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str
    name: str
    balance: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        populate_by_name = True 
        json_encoders = {
            ObjectId: str  # Automatically convert ObjectId to string
        }
        arbitrary_types_allowed = True 
class AccountWithTransactions(BaseModel):
    account: Account
    transaction_count: int
    transactions: List[Transaction]
     
class AccountResponse(BaseModel):
    msg: str
    accounts: List[AccountWithTransactions]
class SingleAccountResponse(BaseModel):
    msg: str
    account: Account
    transaction_count: int
    transactions: List[Transaction]