// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { adminLogin as apiLogin, adminLogout as apiLogout, isAuthenticated } from '../api/axios';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  const login = async (email, password) => { 
    try {
      const response = await apiLogin(email, password);  
      
      
      if (response && response.status === 'success') {
        setIsAuth(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setIsAuth(false);
  };

  const checkAuth = () => {
    setIsAuth(isAuthenticated());
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated: isAuth,
    login,
    logout,
    checkAuth,
  };
};