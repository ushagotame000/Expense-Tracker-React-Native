import { router } from "expo-router";
import { BASE_URL } from "../config/config";


 export interface AccountData {
  user_id: string;
  name: string;
  balance: number;
}

export const addAccount = async (data: AccountData) => {
  try {
    const res = await fetch(`${BASE_URL}/add-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
};


export const getAllUserAccounts = async (user_id: string): Promise<AccountData[]> => {
  try {
    const response = await fetch(`${BASE_URL}/get-user-accounts/${user_id}`, {
      method: 'GET',

    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        return []; 
      }
      throw new Error(data.detail || 'Failed to fetch accounts');
    }

    return data as AccountData[];
  } catch (error) {
    console.error('API Error:', error);
    return []; 
  }
};