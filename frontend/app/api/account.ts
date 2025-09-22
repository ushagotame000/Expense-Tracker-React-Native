import { Float } from "react-native/Libraries/Types/CodegenTypes";
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
}
export interface IAccountCreate{
    user_id: string;
  name: string;
  balance: number;
}
export interface ITotalBalances{
  total_balance: number,
  total_income: number,
  total_expense: number,
}
export interface IAccountResponse {
  msg: string;
  total_balances: ITotalBalances;  
  accounts: AccountWithTransactions[];
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


export const getAllUserAccounts = async (user_id: string): Promise<IAccountResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/get-user-accounts/${user_id}`, {
      method: 'GET',

    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 404) {
        return {
          msg:"No data found",
             total_balances: {
            total_balance: 0,
            total_income: 0,
            total_expense: 0,
          },
          accounts: [],
        } 
      }
      throw new Error(data.detail || 'Failed to fetch accounts');
    }
     const responseData: IAccountResponse = {
      msg: data.msg || 'Success',
      total_balances: data.total_balances, 
      accounts: data.accounts,
    };
    // return data.accounts as AccountWithTransactions[];
    return responseData
  } catch (error) {
    console.error('API Error:', error);
   return {
          msg:"error",
             total_balances: {
            total_balance: 0,
            total_income: 0,
            total_expense: 0,
          },
          accounts: [],
        } 
  }
};

export const deleteAccount = async (account_id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/delete-account/${account_id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};


export const handleEditAccounts = async (
  account_id: string,
  updatedAccount: Partial<AccountData>
) => {
  try {
    const response = await fetch(`${BASE_URL}/edit-account/${account_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedAccount),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("error while editing account", error);
    throw error;
  }
};

export const getUserAccountById = async (account_id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/get-user-account/${account_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    throw error;
  }
};




