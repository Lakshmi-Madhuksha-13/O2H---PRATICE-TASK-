import React, { createContext, useContext, useEffect, useState } from 'react';
import client from '../api/client';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (data: any) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize: Check token and fetch user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('taskora_token');
      if (token) {
        try {
          const res = await client.get('/user');
          // In Laravel resources are wrapped in a 'data' property
          setUser(res.data.data || res.data);
        } catch (err) {
          // Token expired or invalid
          localStorage.removeItem('taskora_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await client.post('/login', credentials);
    const { token, user: userData } = res.data;
    localStorage.setItem('taskora_token', token);
    setUser(userData);
  };

  const register = async (data: any) => {
    const res = await client.post('/register', data);
    const { token, user: userData } = res.data;
    localStorage.setItem('taskora_token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await client.post('/logout');
    } catch (err) {
      // Ignore errors if token is already revoked
    } finally {
      localStorage.removeItem('taskora_token');
      setUser(null);
    }
  };

  const updateProfile = async (data: { name: string; email: string }) => {
    const res = await client.put('/profile', data);
    setUser(res.data.user);
  };

  const forgotPassword = async (email: string) => {
    const res = await client.post('/forgot-password', { email });
    return res.data.reset_token || 'demo-reset-token';
  };

  const resetPassword = async (data: any) => {
    await client.post('/reset-password', data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
