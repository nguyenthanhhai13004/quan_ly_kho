import { Navigate } from "react-router-dom";
import type React from "react";
import { useMe } from "../hooks/auth/use-me";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useMe();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default ProtectedRoute;
