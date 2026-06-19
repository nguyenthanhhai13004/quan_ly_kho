import DashboardView from "../views/dashboard";
import { useMe } from "../queries/auth.query";
import { Navigate } from "react-router-dom";
import { RolesEnum } from "../common/enums/roles.enum";

export default function DashboardPage() {
  const { user } = useMe();

  if (user?.role === RolesEnum.COMMANDER) {
    return <Navigate to="/Commander/Requests" replace />;
  }

  return <DashboardView />;
}
