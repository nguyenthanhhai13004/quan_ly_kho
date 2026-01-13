import type { CustomModalProps } from "../../components/common/custom-modal";
import CustomModal from "../../components/common/custom-modal";
import AssetBatchesTable from "./asset-batches-table";

type AssetBatchesModalProps = CustomModalProps & {
    assetCode:string|null;
    assetName?:string;
}

export default function AssetBatchesModal({onClose,open,assetCode,assetName}:AssetBatchesModalProps){
    if (!assetCode) return;
    return <CustomModal title="Danh sách lô hàng chi tiết" width="w-5xl" open={open} onClose={onClose}>
        <AssetBatchesTable assetName={assetName} assetCode={assetCode}/>
    </CustomModal>
}