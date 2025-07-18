import { BASE_URL } from "../config/config";

export interface TransactionData{
    description: string;
    amount: number;
    user_id: string;
    type: string;
    account_id:string;
}

export const addTransaction = async(data:TransactionData)=>{
    try{
        const res = await fetch(`${BASE_URL}/add-transaction`,{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        })
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
};

export const getAllUserAccounts = async (user_id: string): Promise<TransactionData[]> => {
  try {
    const response = await fetch(`${BASE_URL}/get-transaction/${user_id}`, {
      method: 'GET',
    });

    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        return []; 
      }
      throw new Error(data.detail || 'Failed to fetch transaction');
    }

    return data.transaction as TransactionData[];
  } catch (error) {
    console.error('API Error:', error);
    return []; 
  }
};