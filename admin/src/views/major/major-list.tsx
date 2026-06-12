import { PiPlus } from "react-icons/pi";
import CustomButton from "../../components/common/custom-button";
import MajorsTable from "./majors-table";
import CreateMajorModal from "./modals/create-major-modal";
import { useModalProvider } from "../../providers/modal-provider";


export default function MajorListView() {
  const { openModal } = useModalProvider();
  const openCreateModal = () => openModal(CreateMajorModal);
  
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-semibold py-3">Quản lý hệ</h2>
        <CustomButton
          onClick={openCreateModal}
          label="Tạo mới"
          icon={<PiPlus size={20} />}
        />
      </div>
      <MajorsTable />
    </>
  );
}
