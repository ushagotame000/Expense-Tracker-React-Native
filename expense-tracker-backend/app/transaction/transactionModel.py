from pydantic import BaseModel,Field
from datetime import datetime
from bson import ObjectId
class transaction(BaseModel):
    _id:str
    description: str
    amount: float
    category: str
    type: str
    user_id: str
    account_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    class Config:
        populate_by_name = True 
        json_encoders = {
            ObjectId: str  # Automatically convert ObjectId to string
        }
        arbitrary_types_allowed = True 
class transactionCreate(BaseModel):
    description: str
    amount: float
    user_id: str
    type:str
    account_id: str
