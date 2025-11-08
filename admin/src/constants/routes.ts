import { Fragment } from "react/jsx-runtime";
import AuthLayout from "../components/layouts/auth-layout";
import MainLayout from "../components/layouts/main-layout";
import DashboardPage from "../pages/dashboard-page";
import LoginPage from "../pages/login-page";
import UserListPage from "../pages/user/user-list-page";
import ProfilePage from "../pages/profile-page";
import AssetListPage from "../pages/asset/asset-list-page";
import WarehouseListPage from "../pages/warehouse/warehouse-list-page";
import AccessRightPage from "../pages/system/access-right-page";
import { PermissionsEnum } from "../common/enums/permissons.enum";

type RouteType = {
  path: string;
  element: React.ComponentType;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  permissions?:PermissionsEnum[]
};

export const publicRoutes: RouteType[] = [
  {
    path: "/Login",
    element: LoginPage,
    layout: AuthLayout,
  },
];

// route role
const routesRole: RouteType[] = [
  {
    path: "/Role/List",
    element: Fragment,
    layout: MainLayout,
  },
  {
    path: "/Role/Add",
    element: Fragment,
    layout: MainLayout,
  },
];

const routesUser: RouteType[] = [
  {
    path: "/User/List",
    element: UserListPage,
    layout: MainLayout,
    permissions:[PermissionsEnum.MANAGE_USER]
  }
];

const routesAsset : RouteType[] = [
  {
    path: "/Asset/List",
    element: AssetListPage,
    layout: MainLayout,
  }
];

const routesWarehouse : RouteType[] = [
  {
    path: "/Warehouse/List",
    element: WarehouseListPage,
    layout: MainLayout,
  }
];

const routesSystem : RouteType[] = [
  {
    path: "/AccessRight",
    element: AccessRightPage,
    layout: MainLayout,
  }
];

export const privateRoutes: RouteType[] = [
  {
    path: "/",
    element: DashboardPage,
    layout: MainLayout,
  },
  {
    path: "/Profile",
    element: ProfilePage,
    layout: MainLayout,
  },
  // routes role
  ...routesRole,
  // routes user
  ...routesUser,
  // routes asset
  ...routesAsset,
  // routes warehouse
  ...routesWarehouse,
  // routes systems
  ...routesSystem
];
