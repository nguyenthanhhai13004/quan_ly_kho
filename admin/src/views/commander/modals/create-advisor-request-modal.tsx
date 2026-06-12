import CustomModal from "../../../components/common/custom-modal";
import AssetSelectionTable from "../components/asset-selection-table";
import RequestFormPanel from "../components/request-form-panel";

export default function CreateAdvisorRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <CustomModal
      onClose={onClose}
      open={open}
      title="Tạo yêu cầu cấp phát / thu hồi tài sản"
      width="max-w-7xl w-[95vw]"
      height="h-[550px]"
    >
      <div className="grid grid-cols-3 gap-2 h-full">
        <div className="col-span-2 bg-gray-100 p-2 rounded-xl h-full overflow-hidden">
          <AssetSelectionTable />
        </div>
        <div className="col-span-1 bg-gray-100 p-2 rounded-xl h-full overflow-hidden">
          <RequestFormPanel onClose={onClose} />
        </div>
      </div>
    </CustomModal>
  );
}
