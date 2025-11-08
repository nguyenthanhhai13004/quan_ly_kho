export const PermissionsEnum = {
  MANAGE_USER : "MANAGE_USER", // Quản lý tài khoản Cán bộ kho
  MANAGE_ASSET_CATEGORY : "MANAGE_ASSET_CATEGORY", // Quản lý danh mục tài sản

  ASSET_CREATE : "ASSET_CREATE", // Thêm tài sản
  ASSET_UPDATE : "ASSET_UPDATE", // Sửa tài sản
  ASSET_DELETE : "ASSET_DELETE", // Xóa tài sản

  ASSET_IMPORT : "ASSET_IMPORT", // Nhập kho
  ASSET_EXPORT : "ASSET_EXPORT", // Xuất kho

  ASSET_ASSIGN : "ASSET_ASSIGN", // Cấp phát tài sản
  ASSET_RECALL : "ASSET_RECALL", // Thu hồi tài sản
  ASSET_DISPOSE : "ASSET_DISPOSE", // Thanh lý tài sản

  MAINTENANCE_SCHEDULE : "MAINTENANCE_SCHEDULE", // Lên lịch bảo trì
  MAINTENANCE_LOG : "MAINTENANCE_LOG", // Ghi nhận bảo trì

  ASSET_VIEW_ALL : "ASSET_VIEW_ALL", // Xem tất cả tài sản
  ASSET_VIEW_OWN : "ASSET_VIEW_OWN", // Xem tài sản của mình

  REPORT_VIEW : "REPORT_VIEW", // Xem báo cáo

  MAINTENANCE_VIEW_ALL : "MAINTENANCE_VIEW_ALL", // Xem tất cả lịch bảo trì
  MAINTENANCE_VIEW_OWN : "MAINTENANCE_VIEW_OWN", // Xem lịch bảo trì của mình
} as const;

export type PermissionsEnum = typeof PermissionsEnum[keyof typeof PermissionsEnum];