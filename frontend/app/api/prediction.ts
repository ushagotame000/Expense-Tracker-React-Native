import { BASE_URL } from "../config/config";

export interface PredictedExpensesResponse {
  msg: string;
  predicted_expenses: {
    [category: string]: number;
  };
}

// Fetch predicted expenses
export const getPredictedExpenses = async (user_id: string): Promise<PredictedExpensesResponse | null> => {
  try {
    console.log("Fetching predicted expenses for user_id:", user_id);
    const response = await fetch(`${BASE_URL}/predict-expenses/${user_id}?months_ahead=1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch predicted expenses");
    }

    return data as PredictedExpensesResponse;
  } catch (error) {
    console.error("API Error (getPredictedExpenses):", error);
    return null;
  }
};
