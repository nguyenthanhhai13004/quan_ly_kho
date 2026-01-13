import CustomModal, { type CustomModalProps } from "../../../components/common/custom-modal";
import AssetInWHDetailTabs from "../tabs/asset-in-wh-detail-tabs";

type AssetInWHDetailModalProps = CustomModalProps & {
  assetCode:string | null;
}
export default function AssetInWHDetailModal({assetCode,onClose,open}:AssetInWHDetailModalProps) {
  if (!assetCode) return;
  return (
    <CustomModal title="Chi tiết tài sản" width="w-6xl" onClose={onClose} open={open}>
      <AssetInWHDetailTabs assetCode={assetCode}/>
    </CustomModal>
  );
}
