from fastapi import FastAPI
from .user.authRoute import router as authRoute, get_current_user
import os
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

# app.include_router(auth_routes.router, prefix="/auth")
# app.include_router(todo_router)
app.include_router(authRoute, prefix='/auth')

@app.get("/")
def read_root():
    return {"message": "Expense Tracker Backend Running 🚀","dotenv":  os.getenv("MONGO_URI")}
