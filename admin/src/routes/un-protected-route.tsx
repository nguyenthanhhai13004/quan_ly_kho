import { Navigate } from "react-router-dom";
import type React from "react";
import { getTokens } from "../utils/storage";

const UnProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!getTokens();
  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};

export default UnProtectedRoute;
