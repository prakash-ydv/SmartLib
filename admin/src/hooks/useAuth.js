import { useEffect, useState } from "react";
import {
  adminLogin as apiLogin,
  adminLogout as apiLogout,
  checkAuth as apiCheckAuth,
} from "../api/axios";

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const checkAuth = async () => {
    setIsChecking(true);
    const result = await apiCheckAuth();
    setIsAuth(result);
    setIsChecking(false);
    return result;
  };

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    const ok = response?.status === "success";
    setIsAuth(ok);
    return ok;
  };

  const logout = async () => {
    await apiLogout();
    setIsAuth(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated: isAuth,
    isChecking,
    login,
    logout,
    checkAuth,
  };
};
