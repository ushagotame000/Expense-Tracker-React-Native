from fastapi import APIRouter, HTTPException, Depends
from .accountModel import account,AccountResponse
from app.mongo import account_collection
from bson.objectid import ObjectId
from fastapi.encoders import jsonable_encoder

router = APIRouter()

@router.post("/add-account")
async def addAccount(account: account):
    try:
        await account_collection.insert_one({"user_id": account.user_id, "name": account.name,"balance": account.balance})
        return {"msg": "Account added successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add account: {e}")
@router.put('/edit-account/{account_id}')
async def editAccount(account_id: str,account:account):
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


@router.get('/get-user-accounts/{user_id}',response_model=AccountResponse)
async def getUserAccounts(user_id:str):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid account ID")
    try:
        accounts = await account_collection.find({"user_id": user_id}).to_list(length=None)

        if not accounts:
            raise HTTPException(status_code=404, detail="No accounts found for this user ID")

        return {"msg": "Account fetched successfully","accounts": accounts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch account: {e}")
    
@router.get('/get-user-account/{account_id}',response_model=AccountResponse)
async def getUserAccounts(account_id:str):
    if not ObjectId.is_valid(account_id):
        raise HTTPException(status_code=400, detail="Invalid account ID")
    try:
        accounts = await account_collection.find_one({"_id": account_id})

        if not accounts:
            raise HTTPException(status_code=404, detail="No accounts found for this user ID")

        return {"msg": "Account fetched successfully","accounts": accounts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch account: {e}")