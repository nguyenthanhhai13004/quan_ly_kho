import AssetStatusEnum from "../cores/enums/assets-status.enum";
export const AssetStatusMap: Record<AssetStatusEnum, string> = {
  [AssetStatusEnum.GOOD]: "Tốt",
  [AssetStatusEnum.EXPIRED]: "Hết hạn",
  [AssetStatusEnum.BROKEN]: "Hỏng",
  [AssetStatusEnum.MAINTENANCE]: "Cần bảo trì",
};

export function calculateAssetStatus(expirationDate?: Date, maintenanceDue?: Date): AssetStatusEnum {
  const now = new Date();
  if (expirationDate && now > expirationDate) {
    return AssetStatusEnum.EXPIRED;
  }

  if (maintenanceDue && now > maintenanceDue) {
    return AssetStatusEnum.MAINTENANCE; 
  }

  return AssetStatusEnum.GOOD; 
}


export function getAssetStatusText(status: number): string {
  return AssetStatusMap[status as AssetStatusEnum] || "Không xác định";
}