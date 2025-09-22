import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User ={
  id: string;
}
type AuthContextType = {
  token: string | null;
  user: User |null;
  isLoading: boolean;
  login: (token: string, user_id:string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user:null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null); ;

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const[storedToken,storedUserId] = await Promise.all([
                 AsyncStorage.getItem('access_token'),
                 AsyncStorage.getItem('user_id')
 
        ]);
        if (storedToken && storedUserId) {
          setToken(storedToken),
          setToken(storedUserId);
        }
      } catch (error) {
        console.error('Failed to load data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (newToken: string, userId: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem('access_token', newToken),
        AsyncStorage.setItem('user_id', userId)
      ]);
      setToken(newToken);
      setUser({ id: userId });
    } catch (error) {
      console.error('Failed to save auth data', error);
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem('access_token'),
        AsyncStorage.removeItem('user_id')
      ]);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear auth data', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout,user, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);