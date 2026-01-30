import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("libraryAdmin");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("libraryAdmin");
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    await new Promise((r) => setTimeout(r, 500));

    if (username === "admin" && password === "admin123") {
      const userData = {
        username: "admin",
        role: "admin",
      };

      localStorage.setItem("libraryAdmin", JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("libraryAdmin");
    setUser(null);
  };

  // 🔥 SINGLE SOURCE OF TRUTH
  const isAuthenticated = () => {
    return !!localStorage.getItem("libraryAdmin");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
