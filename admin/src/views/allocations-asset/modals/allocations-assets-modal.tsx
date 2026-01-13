import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import { MdOutlineBatchPrediction } from "react-icons/md";
import AllocationAssetForm from "../allocation-asset-form";
import AssetInWarehouseTable from "../../warehouse/asset-in-warehouse-table";

export default function AllocationsAssetModal({
  onClose,
  open,
}: CustomModalProps) {
  return (
    <CustomModal
      title="Cấp phát tài sản"
      onClose={onClose}
      open={open}
      width="w-7xl"
      height="h-[500px]"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="col-span-1 lg:col-span-2 bg-gray-200 p-2 rounded-2xl">
          <div className=" bg-white p-2 rounded-2xl flex mb-3 gap-2 text-gray-500 text-xs">
            <p>Gợi ý : Chọn vào icon </p>
            <MdOutlineBatchPrediction size={20} className="text-blue-500" />
            <p> để xem và chọn danh sách lô hàng cần cấp phát</p>
          </div>
          <AssetInWarehouseTable isInModal showButtonBatches/>
        </div>
        <div className="col-span-1 bg-gray-200 p-4 pt-5 rounded-2xl">
          <AllocationAssetForm/>
        </div>
      </div>
    </CustomModal>
  );
}
