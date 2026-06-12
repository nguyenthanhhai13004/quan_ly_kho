import { PiPlus } from "react-icons/pi";
import CustomButton from "../../components/common/custom-button";
import ClassesTable from "./classes-table";
import CreateClassModal from "./modals/create-class-modal";
import { useModalProvider } from "../../providers/modal-provider";


export default function ClassListView() {
  const { openModal } = useModalProvider();
  const openCreateModal = () => openModal(CreateClassModal);
  
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-semibold py-3">Quản lý lớp</h2>
        <CustomButton
          onClick={openCreateModal}
          label="Tạo mới"
          icon={<PiPlus size={20} />}
        />
      </div>
      <ClassesTable />
    </>
  );
}
