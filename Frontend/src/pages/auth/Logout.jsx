import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Logout() {
  const { logout, loading } = useAuth();

  useEffect(() => {
    logout(); // this should not set state in a loop
  }, [logout]); // only call once

  if (loading) return <h2>Logging out...</h2>;

  return <Navigate to="/login" replace />;
}