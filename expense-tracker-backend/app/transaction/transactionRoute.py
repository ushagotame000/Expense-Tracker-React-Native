from fastapi import APIRouter, HTTPException, Depends
from .transactionModel import Transaction, TransactionCreate
from app.mongo import transaction_collection, account_collection
from bson.objectid import ObjectId
from ..services.classifier import NaiveBayesClassifier
from datetime import datetime

router = APIRouter()

def get_classifier():
    classifier = NaiveBayesClassifier()
    classifier.load_training_data("app/dataset/training_data.csv")
    return classifier

@router.post("/add-transaction")
async def addTransaction(transaction: TransactionCreate, classifier: NaiveBayesClassifier = Depends(get_classifier)):
    try:
        # predicted_type, predicted_category, _, _ = classifier.classify(transaction.description, transaction.type)
        prediction = classifier.predict_category(transaction.description, transaction.type)
        predicted_category = prediction["predicted_category"]

        return prediction
        await transaction_collection.insert_one({
            "description": transaction.description,
            "amount": transaction.amount,
            "category": predicted_category,
            "type": transaction.type,
            "account_id": transaction.account_id,
            "user_id": transaction.user_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })

        account = await account_collection.find_one({"_id": ObjectId(transaction.account_id)})
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        new_balance = account["balance"]
        if transaction.type.lower() == "income":
            new_balance += transaction.amount
        elif transaction.type.lower() == "expense":
            new_balance -= transaction.amount
        else:
            raise HTTPException(status_code=400, detail="Invalid transaction type")

        await account_collection.update_one(
            {"_id": ObjectId(transaction.account_id)},
            {"$set": {"balance": new_balance}}
        )

        return {
            "msg": "Transaction added successfully",
            "category": predicted_category,
            "type": transaction.type
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add transaction: {e}")

@router.get("/get-transactions/{user_id}")
async def getTransactions(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    try:
        transactions = await transaction_collection.find({"user_id": user_id}).to_list(length=None)
        if not transactions:
            raise HTTPException(status_code=404, detail="No transactions found for this user ID")

        transaction_list = [Transaction(**{**tr, "_id": str(tr["_id"])}) for tr in transactions]

        return {
            "msg": "Transactions fetched successfully",
            "transactions": transaction_list
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transactions: {e}")

@router.get("/get-transaction/{transaction_id}")
async def getTransaction(transaction_id: str):
    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID")
    try:
        transaction = await transaction_collection.find_one({"_id": ObjectId(transaction_id)})
        if not transaction:
            raise HTTPException(status_code=404, detail="No transaction found for this ID")

        transaction = Transaction(**{**transaction, "_id": str(transaction["_id"])})
        # print(transaction)
        return {"msg": "Transaction fetched successfully", "transaction": transaction}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transaction: {e}")

@router.put("/edit-transaction/{transaction_id}")
async def editTransaction(transaction_id: str, updated_transaction: TransactionCreate):
    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID")

    try:
        # Fetch existing transaction
        existing = await transaction_collection.find_one({"_id": ObjectId(transaction_id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Original transaction not found")

        # Fetch account
        account = await account_collection.find_one({"account_id": ObjectId(updated_transaction.account_id)})
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        # Revert old balance impact
        balance = account["balance"]
        if existing["type"].lower() == "income":
            balance -= existing["amount"]
        elif existing["type"].lower() == "expense":
            balance += existing["amount"]

        # Apply updated balance impact
        if updated_transaction.type.lower() == "income":
            balance += updated_transaction.amount
        elif updated_transaction.type.lower() == "expense":
            balance -= updated_transaction.amount
        else:
            raise HTTPException(status_code=400, detail="Invalid transaction type")

        # Update the transaction
        result = await transaction_collection.update_one(
            {"_id": ObjectId(transaction_id)},
            {"$set": {
                "description": updated_transaction.description,
                "amount": updated_transaction.amount,
                "type": updated_transaction.type,
                "category": updated_transaction.category,
                "account_id": updated_transaction.account_id,
                "user_id": updated_transaction.user_id
            }}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not updated")

        # Update balance
        await account_collection.update_one(
            {"_id": ObjectId(updated_transaction.account_id)},
            {"$set": {"balance": balance}}
        )

        return {"msg": "Transaction updated and balance adjusted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update transaction: {e}")

@router.delete("/delete-transaction/{transaction_id}")
async def deleteTransaction(transaction_id: str):
    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID")

    try:
        # Fetch the transaction to be deleted
        transaction = await transaction_collection.find_one({"_id": ObjectId(transaction_id)})
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")

        # Fetch account
        account = await account_collection.find_one({"user_id": transaction["user_id"]})
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        # Revert balance
        balance = account["balance"]
        if transaction["type"].lower() == "income":
            balance -= transaction["amount"]
        elif transaction["type"].lower() == "expense":
            balance += transaction["amount"]

        # Delete the transaction
        result = await transaction_collection.delete_one({"_id": ObjectId(transaction_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Failed to delete transaction")

        # Update balance
        await account_collection.update_one(
            {"_id": transaction["account_id"]},
            {"$set": {"balance": balance}}
        )

        return {"msg": "Transaction deleted and balance adjusted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete transaction: {e}")
