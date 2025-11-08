import { PermissionsEnum } from "../enums/permissons.enum";
export const PERMISSION_LIST_DEFAULT = [
  {
    code: PermissionsEnum.MANAGE_USER,
    name: "Quản lý tài khoản Cán bộ kho",
    id: 1,
  },
  {
    code: PermissionsEnum.MANAGE_ASSET_CATEGORY,
    name: "Quản lý danh mục tài sản",
    id: 2,
  },
  { code: PermissionsEnum.ASSET_CREATE, name: "Thêm tài sản", id: 3 },
  { code: PermissionsEnum.ASSET_UPDATE, name: "Sửa tài sản", id: 4 },
  { code: PermissionsEnum.ASSET_DELETE, name: "Xóa tài sản", id: 5 },
  { code: PermissionsEnum.ASSET_IMPORT, name: "Nhập kho", id: 6 },
  { code: PermissionsEnum.ASSET_EXPORT, name: "Xuất kho", id: 7 },
  { code: PermissionsEnum.ASSET_ASSIGN, name: "Cấp phát tài sản", id: 8 },
  { code: PermissionsEnum.ASSET_RECALL, name: "Thu hồi tài sản", id: 9 },
  { code: PermissionsEnum.ASSET_DISPOSE, name: "Thanh lý tài sản", id: 10 },
  {
    code: PermissionsEnum.MAINTENANCE_SCHEDULE,
    name: "Lên lịch bảo trì",
    id: 11,
  },
  { code: PermissionsEnum.MAINTENANCE_LOG, name: "Ghi nhận bảo trì", id: 12 },
  { code: PermissionsEnum.ASSET_VIEW_ALL, name: "Xem tất cả tài sản", id: 13 },
  {
    code: PermissionsEnum.ASSET_VIEW_OWN,
    name: "Xem tài sản của mình",
    id: 14,
  },
  { code: PermissionsEnum.REPORT_VIEW, name: "Xem báo cáo", id: 15 },
  {
    code: PermissionsEnum.MAINTENANCE_VIEW_ALL,
    name: "Xem tất cả lịch bảo trì",
    id: 16,
  },
  {
    code: PermissionsEnum.MAINTENANCE_VIEW_OWN,
    name: "Xem lịch bảo trì của mình",
    id: 17,
  },
];