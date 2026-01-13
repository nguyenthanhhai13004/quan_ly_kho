import { MdOutlineBatchPrediction } from "react-icons/md";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import DisposalAssetForm from "../disposal-asset-form";
import { useTransactionStore } from "../../../stores/transactions-store";
import { useEffect } from "react";
import AssetInWarehouseTable from "../../warehouse/asset-in-warehouse-table";

export default function DisposalAssetsModal({
  onClose,
  open,
}: CustomModalProps) {
  const {resetBatchState} = useTransactionStore();
    useEffect(()=>{resetBatchState()},[])
  return (
    <CustomModal
      title="Thanh lý tài sản"
      onClose={onClose}
      open={open}
      width="w-7xl"
      height="h-[500px]"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="col-span-1 lg:col-span-2 bg-gray-200 p-2 rounded-2xl">
          <div className=" bg-white p-2 rounded-2xl flex mb-3 gap-2 text-gray-500 text-xs">
            <p>Gợi ý : Chọn vào icon</p>
            <MdOutlineBatchPrediction size={20} className="text-blue-500" />
            <p> để xem và chọn danh sách lô hàng cần thanh lý</p>
          </div>
          <AssetInWarehouseTable isInModal showButtonBatches/>
        </div>
        <div className="col-span-1 bg-gray-200 p-4 pt-5 rounded-2xl">
          <DisposalAssetForm/>
        </div>
      </div>
    </CustomModal>
  );
}
