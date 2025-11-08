import { PiPlus } from "react-icons/pi";
import CustomButton from "../../components/common/custom-button";
import WarehouseTable from "./warehouse-table";
import { FaFileExcel } from "react-icons/fa";

export default function WarehouseListView() {
  return (
    <>
       <div className="flex justify-between items-center mb-3">
          <h2 className="text-3xl font-semibold py-3">Lịch sử xuất nhập</h2>
          <div className="flex gap-2">
            <CustomButton label="Import" icon={<PiPlus size={20} />} />
            <CustomButton
              variant="success"
              label="Import từ Excel"
              icon={<FaFileExcel size={16} />}
            />
            <CustomButton
              variant="success"
              label="Export"
              icon={<FaFileExcel size={16} />}
            />
          </div>
        </div>
        <WarehouseTable />
        
    </>
  );
}
