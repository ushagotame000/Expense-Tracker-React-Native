from fastapi import APIRouter, HTTPException, Depends
from .accountModel import Account,AccountResponse,SingleAccountResponse,AccountWithTransactions
from app.mongo import account_collection,transaction_collection
from bson.objectid import ObjectId
from fastapi.encoders import jsonable_encoder
from ..transaction.transactionModel import Transaction
router = APIRouter()

@router.post("/add-account")
async def addAccount(account: Account):
    try:
        await account_collection.insert_one({"user_id": account.user_id, "name": account.name,"balance": account.balance})
        return {"msg": "Account added successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add account: {e}")
@router.put('/edit-account/{account_id}')
async def editAccount(account_id: str,account:Account):
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID")
    account_data = {
        "user_id": account.user_id,
        "name": account.name,
        "balance": account.balance
    }
    try:
        result = await account_collection.update_one({"_id":ObjectId(account_id)},{"$set":account_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Account not found")
        return {"msg": "Account updated successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update account: {e}")
    
@router.delete('/delete-account/{account_id}')
async def deleteAccount(account_id:str):
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID")
    try:
        result = await account_collection.delete_one({"_id": ObjectId(account_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Account not found")
        return {"msg": "Account deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {e}")


# Get All Accounts for a User
@router.get('/get-user-accounts/{user_id}')
async def getUserAccounts(user_id: str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    try:
        # accounts = await account_collection.find({"user_id": user_id}).to_list(length=None)
        # if not accounts:
        #     raise HTTPException(status_code=404, detail="No accounts found for this user ID")
        # # Convert _id to string before creating Account model instances
        # account_list = [Account(**{**account, "_id": str(account["_id"])}) for account in accounts]
        # return {"msg": "Accounts fetched successfully", "accounts": account_list}
        accounts = await account_collection.find({"user_id": user_id}).to_list(length=None)
        if not accounts:
            raise HTTPException(status_code=404, detail="No accounts found for this user ID")
        
        results = []
        for account in accounts:
            account_id_str = str(account["_id"])
            account_model = Account(**{**account, "_id": account_id_str})

            # Fetch transactions for this account
            transactions_raw = await transaction_collection.find({"account_id": account_id_str}).to_list(length=None)
            transactions = [Transaction(**{**tx, "_id": str(tx["_id"])}) for tx in transactions_raw]
            results.append(AccountWithTransactions(
                account=account_model,
                transaction_count=len(transactions),
                transactions=transactions
            ))
        return {"msg": "Accounts and transactions fetched successfully", "accounts": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch accounts: {str(e)}")

    
    
    
@router.get('/get-user-account/{account_id}',response_model=SingleAccountResponse)
async def getUserAccounts(account_id:str):
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID")
    try:
        account = await account_collection.find_one({"_id": ObjectId(account_id)})
        account_model = Account(**{**account, "_id": str(account["_id"])})
        if not account:
            raise HTTPException(status_code=404, detail="No accounts found for this user ID")

        return {"msg": "Account fetched successfully","account": account_model}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch account: {e}")