import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuth } from "../../api/axios";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
      console.log(
        "🔒 Route Check:",
        isAuth ? "Authenticated" : "Not Authenticated",
        location.pathname,
      );
    };
    verify();
  }, [location]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    ); // Simple loading state
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
