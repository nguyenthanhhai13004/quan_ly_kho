import { AiFillDashboard } from "react-icons/ai";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { FaUser } from "react-icons/fa";
import { GrHostMaintenance } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdOutlineWebAsset } from "react-icons/md";
import { PiWarehouseBold } from "react-icons/pi";
import { PermissionsEnum } from "../common/enums/permissons.enum";

export const SIDEBAR_ITEMS = [
  {
    icon: <AiFillDashboard size={20} />,
    label: "Dashboard",
    path: "/",
    children: [],
  },
  {
    icon: <FaUser size={20} />,
    label: "Người dùng",
    path: "/User/List",
    children: [
      {
        label: "Loại người dùng",
        path: "/Role/List",
      },
      {
        label: "Thêm loại người dùng",
        path: "/Role/Add",
      },
      {
        label: "Danh sách người dùng",
        path: "/User/List",
      },
      {
        label: "Thêm người dùng",
        path: "/User/Add",
      },
    ],
    permissions:[PermissionsEnum.MANAGE_USER]
  },
  {
    icon: <MdOutlineWebAsset size={20} />,
    label: "Quản lý tài sản",
    path: "/Asset/List",
    children: [],
  },
  {
    icon: <PiWarehouseBold size={20} />,
    label: "Quản lý kho",
    path: "/Warehouse/List",
  },
  {
    icon: <GrHostMaintenance size={20} />,
    label: "Quản lý bảo trì",
    path: "/Warehouse/ist",
  },
  {
    icon: <CgArrowsExchangeAlt size={20} />,
    label: "QL Cấp phát",
    path: "/Warehouse/Lis",
  },
  {
    icon: <HiOutlineDocumentReport size={20} />,
    label: "Báo cáo- Thống kê",
    path: "/a",
  },
];
