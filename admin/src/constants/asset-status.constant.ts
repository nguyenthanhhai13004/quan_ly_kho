import { AssetStatusEnum } from "../common/enums/asset-status.enum";

export const ASSET_STATUS = [
  {
    label: "Tốt",
    value: AssetStatusEnum.GOOD,
  },
  {
    label: "Cần bảo trì",
    value: AssetStatusEnum.MAINTENANCE,
  },
  {
    label: "Lỗi",
    value: AssetStatusEnum.BROKEN,
  },
  {
    label: "Hết hạn",
    value: AssetStatusEnum.EXPIRED,
  },
];

export const ASSET_IN_RETURN_STATUS = [
  {
    label: "Tốt",
    value: AssetStatusEnum.GOOD,
  },
  {
    label: "Lỗi",
    value: AssetStatusEnum.BROKEN,
  },
  {
    label: "Hết hạn",
    value: AssetStatusEnum.EXPIRED,
  },
];
