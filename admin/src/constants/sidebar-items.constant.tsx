import { AiFillDashboard } from "react-icons/ai";
import { FaUser, FaWarehouse } from "react-icons/fa";
import { GrHostMaintenance, GrTransaction } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import {
  MdCategory,
  MdOutlineMoveDown,
  MdOutlineWebAsset,
  MdWorkHistory,
} from "react-icons/md";
import { PiWarehouseBold } from "react-icons/pi";
import { PermissionsEnum } from "../common/enums/permissons.enum";

export const SIDEBAR_ITEMS = [
  {
    icon: <AiFillDashboard size={20} />,
    label: "Dashboard",
    path: "/",
    permissions: [PermissionsEnum.DASHBOARD_VIEW],
    children: [],
  },
  {
    icon: <MdOutlineMoveDown size={20} />,
    label: "Tài sản được cấp phát",
    path: "/Asset/Own",
    permissions: [PermissionsEnum.ASSET_VIEW_OWN],
    children: [],
  },
  {
    icon: <FaUser size={20} />,
    label: "Người dùng",
    path: "/User/List",
    permissions: [PermissionsEnum.MANAGE_USER],
  },
  {
    icon: <MdOutlineWebAsset size={20} />,
    label: "Quản lý tài sản",
    path: "/Asset/List",
    permissions: [PermissionsEnum.ASSET_VIEW_ALL],
    children: [],
  },
  {
    icon: <MdCategory size={20} />,
    label: "Quản lý danh mục",
    path: "/Category",
    permissions: [PermissionsEnum.MANAGE_ASSET_CATEGORY],
    children: [],
  },
  {
    icon: <PiWarehouseBold size={20} />,
    label: "Quản lý xuất nhập kho",
    path: "/Warehouse/List",
    permissions: [
      PermissionsEnum.ASSET_ASSIGN,
      PermissionsEnum.ASSET_CREATE,
      PermissionsEnum.ASSET_DISPOSE,
      PermissionsEnum.ASSET_EXPORT,
      PermissionsEnum.ASSET_IMPORT,
      PermissionsEnum.ASSET_RECALL,
    ],
    children: [
      {
        label: "Tài sản trong kho",
        path: "/Warehouse/Assets",
      },
      {
        label: "Cấp phát - Thu hồi",
        path: "/Transaction/AllocationsAsset",
      },
      {
        label: "Thanh lý tài sản",
        path: "/Transaction/DisposalAsset",
      },
      {
        label: "Lịch sử giao dịch",
        path: "/Transaction/History",
      },
    ],
  },
  {
    icon: <GrHostMaintenance size={20} />,
    label: "Quản lý bảo trì",
    path: "/Maintenance/List",
    permissions: [PermissionsEnum.MAINTENANCE_SCHEDULE],
  },
   {
    icon: <MdWorkHistory size={20} />,
    label: "Lịch sử hoạt động",
    path: "/Logs",
    permissions: [PermissionsEnum.LOGS_VIEW],
  },
  {
    icon: <FaWarehouse size={20} />,
    label: "Danh sách kho",
    path: "/Warehouse/List",
    permissions: [PermissionsEnum.WAREHOUSE_LIST_VIEW],
  },
  {
    icon: <HiOutlineDocumentReport size={20} />,
    label: "Báo cáo- Thống kê",
    path: "/Report",
    permissions: [PermissionsEnum.REPORT_VIEW],
    children: [
      {
        label: "Báo cáo tồn kho",
        path: "/Report/Inventory",
      },
      {
        label: "Báo cáo cấp phát",
        path: "/Report/Allocation",
      },
      {
        label: "Báo cáo thanh lý",
        path: "/Report/Disposal",
      },
      {
        label: "Báo cáo bảo trì",
        path: "/Report/Maintenance",
      },
    ],
  },
];
