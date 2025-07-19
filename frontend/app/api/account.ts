import { BASE_URL } from "../config/config";
import { TransactionData } from "./transaction";


 export interface AccountData {
   _id:string;
  user_id: string;
  name: string;
  balance: number;

}
export interface AccountWithTransactions {
  account: AccountData;
  transaction_count: number;
  transactions: TransactionData[];
  total_balance: number;
}
export interface IAccountCreate{
    user_id: string;
  name: string;
  balance: number;
}

export const addAccount = async (data: IAccountCreate) => {
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


export const getAllUserAccounts = async (user_id: string): Promise<AccountWithTransactions[]> => {
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
    return data.accounts as AccountWithTransactions[];
  } catch (error) {
    console.error('API Error:', error);
    return []; 
  }
};