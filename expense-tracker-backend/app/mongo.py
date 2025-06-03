from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "budget_buddy")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

user_collection = db.users