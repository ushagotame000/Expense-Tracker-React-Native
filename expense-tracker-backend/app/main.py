from fastapi import FastAPI
from .user.authRoute import router as authRoute, get_current_user
from .accounts.accountRoute import router as accountRoute
from .transaction.transactionRoute import router as transactionRoute

from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
load_dotenv()
app = FastAPI()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

app.include_router(authRoute, prefix='/auth')
app.include_router(accountRoute)
app.include_router(transactionRoute)
@app.get("/")
def read_root():
    return {"message": "Expense Tracker Backend Running 🚀"}
