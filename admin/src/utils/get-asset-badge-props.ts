import { AssetStatusEnum } from "../common/enums/asset-status.enum";
import type { CustomBadgeProps } from "../components/common/custom-badge";

export const getAssetBadgeProps = (status: number): CustomBadgeProps => {
  switch (status) {
    case AssetStatusEnum.ACTIVE:
      return { label: "Tốt", status: "success" };
    case AssetStatusEnum.MAINTENANCE:
      return { label: "Cần bảo trì", status: "warning" };
    case AssetStatusEnum.IN_ACTIVE:
      return { label: "Lỗi / Hết hạn", status: "error" };
    case AssetStatusEnum.BROKEN:
      return { label: "Thanh lý", status: "default" };
    default:
      return { label: "Không xác định", status: "info" };
  }
};