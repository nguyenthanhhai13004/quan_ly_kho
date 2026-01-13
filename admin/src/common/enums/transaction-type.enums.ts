export const  TransactionTypeEnum = {
    ALLOCATION_RETURN:1,
    DISPOSAL:2,
    IMPORT:3,
    EXPORT:4,
    MAINTENANCE:5
}

export const TransactionTypeText: Record<number, string> = {
  [TransactionTypeEnum.IMPORT]: "Nhập kho",
  [TransactionTypeEnum.EXPORT]: "Xuất kho",
  [TransactionTypeEnum.MAINTENANCE]: "Bảo trì",
  [TransactionTypeEnum.DISPOSAL]: "Thanh lý",
  [TransactionTypeEnum.ALLOCATION_RETURN]: "Cấp phát - Thu hồi"
};