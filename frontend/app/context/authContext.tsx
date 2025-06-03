import React, { createContext, useContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as loginApi, register as registerApi } from '../api/auth';

type User = { username: string; email: string };

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const data = await loginApi(username, password);
    if (data.token) {
      setUser(data.user);
      setToken(data.token);
      await SecureStore.setItemAsync('token', data.token);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await registerApi(username, email, password);
    if (data.token) {
      setUser(data.user);
      setToken(data.token);
      await SecureStore.setItemAsync('token', data.token);
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
