import { Navigate } from "react-router-dom";
import type React from "react";
import { useMe } from "../queries/auth.query";
import LoadingView from "../views/loading";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useMe();
  if (isLoading) {
    return <LoadingView/>
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
};

export default ProtectedRoute;
