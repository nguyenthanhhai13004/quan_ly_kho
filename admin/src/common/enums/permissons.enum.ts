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
  
  LOGS_VIEW: "LOGS_VIEW",                       // Xem nhật ký hoạt động hệ thống
  WAREHOUSE_LIST_VIEW: "WAREHOUSE_LIST_VIEW",   // Xem danh sách kho
  DASHBOARD_VIEW: "DASHBOARD_VIEW",             // Xem trang tổng quan (Dashboard)
  
  COMMANDER_STUDENTS_VIEW: "COMMANDER_STUDENTS_VIEW",       // Cố vấn xem danh sách sinh viên
  COMMANDER_REQUESTS_MANAGE: "COMMANDER_REQUESTS_MANAGE",   // Cố vấn quản lý yêu cầu tài sản

  WAREHOUSE_OFFICER_REQUESTS_VIEW: "WAREHOUSE_OFFICER_REQUESTS_VIEW",       // Cán bộ kho xem yêu cầu tài sản
  WAREHOUSE_OFFICER_REQUESTS_APPROVE: "WAREHOUSE_OFFICER_REQUESTS_APPROVE", // Cán bộ kho duyệt yêu cầu tài sản
} as const;

export type PermissionsEnum = typeof PermissionsEnum[keyof typeof PermissionsEnum];