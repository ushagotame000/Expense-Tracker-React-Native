from pydantic import BaseModel

class transactions(BaseModel):
    description: str
    amount: float
    category: str
    type: str
    