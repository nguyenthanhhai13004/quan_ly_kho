import { PiPlus } from "react-icons/pi";
import CustomButton from "../../components/common/custom-button";
import AssetsTable from "./assets-table";
import CreateAssetModal from "./modals/create-asset-modal";
import { useModalProvider } from "../../providers/modal-provider";


export default function AssetListView() {
  const { openModal } = useModalProvider();
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-semibold py-3">Quản lý danh mục tài sản</h2>
        <div className="flex gap-2">
          <CustomButton
            onClick={() => openModal(CreateAssetModal)}
            label="Tạo mới"
            icon={<PiPlus size={20} />}
          />
        </div>
      </div>
      <AssetsTable />
    </>
  );
}
