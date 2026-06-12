import { BiHome } from "react-icons/bi";
export const breadcrumbs = {
  home:{ label: "Home", path: "/", icon: <BiHome size={20} /> },
  user:{ label: "Người dùng", path: "/User/List"},
  profile:{ label: "Thông tin của tôi", path: "/Profile"},
  asset:{ label: "Quản lý tài sản", path: "/Asset/List"},
  warehouse:{ label: "Quản lý kho", path: "/Warehouse/List"},
  system:{ label: "Hệ thống", path: "/"},
}