import { Fragment } from "react/jsx-runtime";
import AuthLayout from "../components/layouts/auth-layout";
import MainLayout from "../components/layouts/main-layout";
import DashboardPage from "../pages/dashboard-page";
import LoginPage from "../pages/login-page";
import UserListPage from "../pages/user/user-list-page";
import ProfilePage from "../pages/profile-page";
import AssetListPage from "../pages/asset/asset-list-page";
import AccessRightPage from "../pages/system/access-right-page";
import { PermissionsEnum } from "../common/enums/permissons.enum";
import CategoryPage from "../pages/category-page";
import MaintenancePage from "../pages/maintenance-page";
import AllocationsAssetPage from "../pages/transaction/allocations-asset-page";
import DisposalAssetPage from "../pages/transaction/disposal-assets-page";
import type { SEOProps } from "../hooks/use-seo";
import WarehouseAssetsPage from "../pages/warehouse-assets-page";
import ReportInventoryPage from "../pages/reports/report-inventory-page";
import ReportAllocationPage from "../pages/reports/report-allocation-page";
import ReportDisposalPage from "../pages/reports/report-disposal-page";
import ReportMaintenancePage from "../pages/reports/report-maintenance-page";
import TransactionsHistoryPage from "../pages/transaction/transactions-history-page";
import AssetOwnPage from "../pages/asset/asset-own-page";
import WarehouseListPage from "../pages/warehouse/warehouse-list-page";
import LogPage from "../pages/log-page";
import ResetPwPage from "../pages/reset-pw-page";

type RouteType = {
  path: string;
  element: React.ComponentType;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  permissions?:PermissionsEnum[]
  seo?:SEOProps
};

export const publicRoutes: RouteType[] = [
  {
    path: "/Login",
    element: LoginPage,
    layout: AuthLayout,
    seo:{
      title:"Đăng nhập"
    }
  },
  {
    path: "/reset-pw",
    element: ResetPwPage,
    layout: AuthLayout,
    seo:{
      title:"Quên mật khẩu"
    }
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
    permissions:[PermissionsEnum.MANAGE_USER],
    seo:{
      title:"Quản lý người dùng"
    }
  }
];

const routesReports: RouteType[] = [
  {
    path: "/Report/Inventory",
    element: ReportInventoryPage,
    layout: MainLayout,
    permissions:[
      PermissionsEnum.REPORT_VIEW
    ],
    seo:{
      title:"Báo cáo tồn kho"
    }
  },
   {
    path: "/Report/Allocation",
    element: ReportAllocationPage,
    layout: MainLayout,
    permissions:[
      PermissionsEnum.REPORT_VIEW
    ],
    seo:{
      title:"Báo cáo cấp phát - thu hồi"
    }
  },
   {
    path: "/Report/Disposal",
    element: ReportDisposalPage,
    layout: MainLayout,
    permissions:[
      PermissionsEnum.REPORT_VIEW
    ],
    seo:{
      title:"Báo cáo thanh lý"
    }
  },
   {
    path: "/Report/Maintenance",
    element: ReportMaintenancePage,
    layout: MainLayout,
    permissions:[
      PermissionsEnum.REPORT_VIEW
    ],
    seo:{
      title:"Báo cáo bảo trì"
    }
  },
];

const routesAsset : RouteType[] = [
  {
    path: "/Asset/List",
    element: AssetListPage,
    layout: MainLayout,
    seo:{
      title:"Quản lý tài sản"
    }
  },
  {
    path: "/Asset/Own",
    element: AssetOwnPage,
    layout: MainLayout,
    seo:{
      title:"Tài sản được cấp phát"
    }
  }
];

const routesWarehouse : RouteType[] = [
  {
    path: "/Warehouse/Assets",
    element: WarehouseAssetsPage,
    layout: MainLayout,
    seo:{
      title:"Quản lý lô hàng"
    }
  },
   {
    path: "/Warehouse/List",
    element: WarehouseListPage,
    layout: MainLayout,
    permissions:[PermissionsEnum.WAREHOUSE_LIST_VIEW],
    seo:{
      title:"Quản lý kho"
    }
  },
  {
    path: "/Transaction/History",
    element: TransactionsHistoryPage,
    layout: MainLayout,
    seo:{
      title:"Lịch sử giao dịch"
    }
  },
];

const routesSystem : RouteType[] = [
  {
    path: "/AccessRight",
    element: AccessRightPage,
    layout: MainLayout,
  }
];

const routeTransaction : RouteType[] = [
  {
    path: "/Transaction/AllocationsAsset",
    element: AllocationsAssetPage,
    layout: MainLayout,
    seo:{
      title:"Quản lý cấp phát - thu hồi tài sản"
    }
  },
  {
    path: "/Transaction/DisposalAsset",
    element: DisposalAssetPage,
    layout: MainLayout,
    seo:{
      title:"Quản lý thanh lý tài sản"
    }
  },
];

export const privateRoutes: RouteType[] = [
  {
    path: "/",
    element: DashboardPage,
    permissions:[PermissionsEnum.DASHBOARD_VIEW],
    layout: MainLayout,
  },
  {
    path: "/Profile",
    element: ProfilePage,
    layout: MainLayout,
  },
  {
    path: "/Category",
    element: CategoryPage,
    layout: MainLayout,
    seo:{
      title:"Quản lý danh mục"
    }
  },
  {
    path: "/Logs",
    element: LogPage,
    layout: MainLayout,
    seo:{
      title:"Lịch sử hoạt động"
    }
  },
  {
    path:"/Maintenance/List",
    element:MaintenancePage,
    layout:MainLayout,
    seo:{
      title:"Quản lý bảo trì"
    }
  },
  // {
  //   path:"/Report",
  //   element:ReportPage,
  //   layout:MainLayout,
  //   seo:{
  //     title:"Báo cáo - Thống kê"
  //   }
  // },
  ...routesReports,
  ...routeTransaction,
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
