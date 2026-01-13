import type { CustomModalProps } from "../../../components/common/custom-modal";
import CustomModal from "../../../components/common/custom-modal";
import MaintenanceForm from "../maintenance-form";
import BatchesNeedMaintenanceTable from "../tables/batches-need-maintenance-table";

export default function CreateMaintenanceModal({
  onClose,
  open,
}: CustomModalProps) {
  return (
    <CustomModal
      width="w-7xl"
      title="Lên lịch bảo trì tài sản"
      onClose={onClose}
      open={open}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        <div className="col-span-1 lg:col-span-2 bg-gray-200 p-2 rounded-2xl">
          <BatchesNeedMaintenanceTable />
        </div>
        <div className="col-span-1 bg-gray-200 p-4 pt-5 rounded-2xl">
          <MaintenanceForm/>
        </div>
      </div>
    </CustomModal>
  );
}
