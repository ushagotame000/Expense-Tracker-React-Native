from fastapi import APIRouter, HTTPException, Depends
from .transactionModel import transaction, transactionCreate
from app.mongo import transaction_collection
from bson.objectid import ObjectId
from fastapi.encoders import jsonable_encoder
from ..services.classifier import NaiveBayesClassifier
import os

router = APIRouter()

def get_classifier():
    classifier = NaiveBayesClassifier()    
    classifier.load_training_data("app/dataset/training_data.csv")
    return classifier

@router.post("/add-transaction")
async def addTransaction(transaction: transactionCreate, classifier: NaiveBayesClassifier = Depends(get_classifier)):
    try:
        predicted_type, predicted_category, _, _ = classifier.classify(transaction.description)
        # return classifier.classify(transaction.description)
        await transaction_collection.insert_one({
            "description": transaction.description,
            "amount": transaction.amount,
            "category": predicted_category,
            "type": predicted_type,
            "user_id": transaction.user_id,
            "transaction_id": transaction.transaction_id,
        })
        
        return {"msg": "Transaction added successfully", "category": predicted_category, "type": predicted_type}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add transaction: {e}")

@router.get('/get-transactions/{user_id}')
async def getTransactions(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    try:
        transactions = await transaction_collection.find({"user_id": user_id}).to_list(length=None)

        if not transactions:
            raise HTTPException(status_code=404, detail="No transactions found for this user ID")

        return {"msg": "Transactions fetched successfully", "transactions": transactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transactions: {e}")

@router.get('/get-transaction/{transaction_id}')
async def getTransaction(transaction_id: str):
    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID")
    try:
        transaction = await transaction_collection.find_one({"transaction_id": transaction_id})

        if not transaction:
            raise HTTPException(status_code=404, detail="No transaction found for this transaction ID")

        return {"msg": "Transaction fetched successfully", "transaction": transaction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transaction: {e}")

@router.put('/edit-transaction/{transaction_id}')
async def editTransaction(transaction_id: str, updated_transaction: transactionCreate):
    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID")
    try:
        result = await transaction_collection.update_one(
            {"transaction_id": transaction_id},
            {"$set": {
                "description": updated_transaction.description,
                "amount": updated_transaction.amount,
                "user_id": updated_transaction.user_id,
                "transaction_id": updated_transaction.transaction_id,
            }}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found or no changes made")

        return {"msg": "Transaction updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update transaction: {e}")

@router.delete('/delete-transaction/{transaction_id}')
async def deleteTransaction(transaction_id: str):
    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID")
    try:
        result = await transaction_collection.delete_one({"transaction_id": transaction_id})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")

        return {"msg": "Transaction deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete transaction: {e}")
