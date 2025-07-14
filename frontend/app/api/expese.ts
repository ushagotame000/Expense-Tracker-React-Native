import { router } from "expo-router";

const BASE_URL = 'http://127.0.0.1:8000';

 export interface ExpenseData {
  user_id: string;
  name: string;
  balance: number;
}

export const addExpense = async (data: ExpenseData) => {
  try {
    const res = await fetch(`${BASE_URL}/add-expense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};