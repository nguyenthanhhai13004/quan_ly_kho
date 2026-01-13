import { MdOutlineBatchPrediction } from "react-icons/md";
import ExportManualForm from "./export-manual-form";
import AssetInWarehouseTable from "../warehouse/asset-in-warehouse-table";

export default function ExportAssetsView() {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 bg-gray-200 p-2 rounded-2xl">
          <div className=" bg-white p-2 rounded-2xl flex mb-3 gap-2 text-gray-500 text-xs">
            <p>Gợi ý : Chọn vào icon </p>
            <MdOutlineBatchPrediction size={20} className="text-blue-500" />
            <p> để xem và chọn danh sách lô hàng của tài sản cần xuất kho</p>
          </div>
          <AssetInWarehouseTable isInModal showButtonBatches/>
        </div>
        <div className="col-span-1 bg-gray-200 p-4 pt-5 rounded-2xl">
          <ExportManualForm />
        </div>
      </div>
    </>
  );
}
