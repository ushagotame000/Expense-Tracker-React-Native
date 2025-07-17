from pydantic import BaseModel,Field
from datetime import datetime

class transaction(BaseModel):
    description: str
    amount: float
    category: str
    type: str
    user_id: str
    account_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
class transactionCreate(BaseModel):
    description: str
    amount: float
    user_id: str
