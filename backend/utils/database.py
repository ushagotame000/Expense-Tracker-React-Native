from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import Depends
from dotenv import load_dotenv
import os
import logging

load_dotenv()
logger = logging.getLogger(__name__)

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI not set in environment")
DATABASE_NAME = os.getenv("DATABASE_NAME", "budget_app")

def get_mongo_client() -> AsyncIOMotorClient:
    try:
        client = AsyncIOMotorClient(MONGO_URI)
        logger.info("MongoDB client created")
        return client
    except Exception as e:
        logger.error(f"Failed to create MongoDB client: {e}")
        raise

async def get_db(client: AsyncIOMotorClient = Depends(get_mongo_client)):
    db = client[DATABASE_NAME]
    try:
        yield db
    finally:
        pass