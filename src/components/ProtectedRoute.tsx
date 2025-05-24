import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

interface Props {
  children: React.ReactNode;
  requiredRole?: "police" | "user";
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
