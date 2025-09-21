import { BASE_URL } from "../config/config";

export interface TransactionData {
  description: string;
  amount: number;
  user_id: string;
  type: string;
  account_id?: string;
  time:string;
  date:string;
}
export interface TransactionDataFetch {
  description: string;
  amount: number;
  user_id: string;
  type: string;
  _id?: string;
  created_at: string;
  updated_at?: string;
  category:string;
  account_id?:string;

}


export const addTransaction = async (data: TransactionData) => {
  try {
    const res = await fetch(`${BASE_URL}/add-transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};

export const getAllTransaction = async (
  user_id: string
): Promise<TransactionDataFetch[]> => {
  try {
    const response = await fetch(`${BASE_URL}/get-transactions/${user_id}`, {
      method: "GET",
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(data.detail || "Failed to fetch transaction");
    }

    return data.transactions as TransactionDataFetch[];
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};


export const deleteTransaction = async (transaction_id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/delete-transaction/${transaction_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const editTransaction = async (
  transaction_id: string,
  updatedTransaction: Partial<TransactionData>
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/edit-transaction/${transaction_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTransaction),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error while editing transaction", error);
    throw error;
  }
};


export const getTransactionById = async (transaction_id: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/get-transaction/${transaction_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    throw error;
  }
};