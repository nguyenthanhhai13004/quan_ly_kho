import { AssetStatusEnum } from "../common/enums/asset-status.enum";

export const ASSET_STATUS = [
  {
    label: "Tốt",
    value: AssetStatusEnum.ACTIVE,
  },
  {
    label: "Cần bảo trì",
    value: AssetStatusEnum.MAINTENANCE,
  },
  {
    label: "Lỗi / Hết hạn",
    value: AssetStatusEnum.IN_ACTIVE,
  },
  {
    label: "Thanh lý",
    value: AssetStatusEnum.BROKEN,
  },
];