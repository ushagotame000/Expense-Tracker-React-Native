from fastapi import FastAPI
import logging
from routers import auth
from utils.database import get_mongo_client
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(), logging.FileHandler("app.log")]
)
logger = logging.getLogger(__name__)

app = FastAPI(title='Budget Buddy')
app = FastAPI(title="Nepal Budgeting App Backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.mongo_client = get_mongo_client()
    logger.info("MongoDB client initialized")
    yield
    app.state.mongo_client.close()
    logger.info("MongoDB client closed")

app.lifespan = lifespan
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


@app.get("/")
async def root():
    return {"message": "Budgeting App Backend"}