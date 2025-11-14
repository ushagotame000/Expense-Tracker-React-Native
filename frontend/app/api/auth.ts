<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { BASE_URL } from "../config/config";


export const register = async (username: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
};

export const login = async(username:string, password:string)=>{
   const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
    const res = await fetch(`${BASE_URL}/auth/login`,{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded',},
        body: formData.toString(),
    })
    if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail?.[0]?.msg || 'Login failed');
  }
  
  return res.json();
};
 export const logout = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('user_id');
  router.replace('/auth/login'); 
=======
>>>>>>> Stashed changes
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { BASE_URL } from "../config/config";


export const register = async (username: string, email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
};

export const login = async (username: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  console.log(BASE_URL)
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', },
    body: formData.toString(),
  })
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail?.[0]?.msg || 'Login failed');
  }

  return res.json();
};
export const logout = async () => {
  await AsyncStorage.removeItem('access_token');
  await AsyncStorage.removeItem('user_id');
  router.replace('/auth/login');
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
};