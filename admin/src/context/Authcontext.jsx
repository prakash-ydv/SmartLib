/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState } from "react";
import {
  adminLogin,
  adminLogout,
  checkAuth as verifyAdminSession,
} from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    const isValid = await verifyAdminSession();
    const savedUser = localStorage.getItem("adminData");

    if (isValid && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsLoading(false);
    return isValid;
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (email, password) => {
    const response = await adminLogin(email, password);
    await refreshSession();
    return response?.status === "success";
  };

  const logout = async () => {
    await adminLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: () => Boolean(user),
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
