from fastapi import APIRouter, HTTPException
from bson.objectid import ObjectId
from datetime import datetime
from collections import defaultdict
from app.mongo import transaction_collection
from app.services.regression import linear_regression_predict
from app.services.spending_utils import detect_unusual_spending
router = APIRouter()

@router.get("/predict-expenses/{user_id}")
async def predict_category_expenses(user_id: str, months_ahead: int = 1):
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    user_id = ObjectId(user_id)

    try:
        pipeline = [
            {"$match": {
                "user_id": user_id,
                "type": "expense"
            }},
            {"$group": {
                "_id": {
                    "category": "$category",
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                },
                "total_amount": {"$sum": "$amount"}
            }},
            {"$sort": {
                "_id.category": 1,
                "_id.year": 1,
                "_id.month": 1
            }}
        ]

        raw_data = await transaction_collection.aggregate(pipeline).to_list(None)
        # print('working')
        # return {'msg': raw_data}
        # print(raw_data)
        category_data = defaultdict(list)
        category_months = defaultdict(list)

        for entry in raw_data:
            cat = entry["_id"]["category"]
            month_number = entry["_id"]["year"] * 12 + entry["_id"]["month"]
            category_months[cat].append(month_number)
            category_data[cat].append(entry["total_amount"])

        predictions = {}

        # for category, y in category_data.items():
        #     X = category_months[category]
        #     if len(X) < 2:
        #         predictions[category] = "Not enough data"
        #         continue

        #     m, b = linear_regression_predict(X, y)
        #     next_month = max(X) + months_ahead
        #     predicted_amount = predict_future(m, b, next_month)

        #     predictions[category] = round(float(predicted_amount), 2)

        for category, y in category_data.items():
            x = category_months[category]
            if len(x) < 2:
                predictions[category] = "Not enough data"
                continue

            next_month = max(x) + months_ahead
            predicted_amount = linear_regression_predict(x, y, next_month)

            # --- Occasional spending adjustment ---
            unusual_spikes = detect_unusual_spending(y)
            month_numbers_mod12 = [m % 12 for m in x]  # month pattern
            current_month_mod12 = (next_month % 12)

            if current_month_mod12 in month_numbers_mod12:
                idxs = [i for i, m in enumerate(month_numbers_mod12) if m == current_month_mod12]
                for idx in idxs:
                    if y[idx] in unusual_spikes:
                        predicted_amount *= 1.3  # boost by 30%
                        break

            predictions[category] = round(float(predicted_amount), 2)
        
        return {
            "msg": f"Predicted expenses per category for next {months_ahead} month(s)",
            "predicted_expenses": predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to predict expenses: {e}")
