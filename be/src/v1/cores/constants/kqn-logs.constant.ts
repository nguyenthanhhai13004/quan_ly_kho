import { LogAction, LogController } from "../enums/logs.enum";

export const LOG_ACTIONS_DEFAULT = [
  {
    name: "Create",
    code: LogAction.CREATE,
    description: "Tạo mới dữ liệu",
  },
  {
    name: "Edit",
    code: LogAction.EDIT,
    description: "Chỉnh sửa dữ liệu",
  },
  {
    name: "Delete",
    code: LogAction.DELETE,
    description: "Xóa dữ liệu",
  },
  {
    name: "Account",
    code: LogAction.ACCOUNT,
    description: "Thao tác liên quan tới tài khoản",
  },
  {
    name: "Export",
    code: LogAction.EXPORT,
    description: "Thao tác liên quan tới xuất dữ liệu",
  },
  {
    name: "Import",
    code: LogAction.IMPORT,
    description: "Thao tác liên quan tới nhập dữ liệu",
  },
];

export const LOG_CONTROLLERS_DEFAULT = [
  {
    name: "AllocationController",
    code: LogController.ALLOCATION,
    description: "Quản lý cấp phát vật tư",
  },
  {
    name: "UserController",
    code: LogController.USER,
    description: "Quản lý người dùng",
  },
  {
    name: "TransactionController",
    code: LogController.TRANSACTION,
    description: "Quản lý giao dịch",
  },
  {
    name: "AssetController",
    code: LogController.ASSET,
    description: "Quản lý tài sản",
  },
  {
    name: "AccessController",
    code: LogController.ACCESS,
    description: "asset",
  },
  {
    name: "CategoryController",
    code: LogController.CATEGORY,
    description: "Quản lý",
  },
  {
    name: "WarehouseController",
    code: LogController.WAREHOUSE,
    description: "Quản lý",
  },
];
