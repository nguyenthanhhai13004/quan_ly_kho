import { AssetStatusEnum } from "../common/enums/asset-status.enum";
import type { CustomBadgeProps } from "../components/common/custom-badge";

export const getAssetBadgeProps = (status: number): CustomBadgeProps => {
  console.log("status",status)
  switch (status) {
    case AssetStatusEnum.GOOD:
      return { label: "Tốt", status: "success" };
    case AssetStatusEnum.MAINTENANCE:
      return { label: "Cần bảo trì", status: "warning" };
    case AssetStatusEnum.BROKEN:
      return { label: "Lỗi", status: "error" };
    case AssetStatusEnum.EXPIRED:
      return { label: "Hết hạn", status: "default" };
    default:
      return { label: "Không xác định", status: "info" };
  }
};
