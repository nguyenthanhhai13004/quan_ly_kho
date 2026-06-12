import { PiPlus } from "react-icons/pi";
import CustomButton from "../../components/common/custom-button";
import StudentsTable from "./students-table";
import CreateStudentModal from "./modals/create-student-modal";
import { useModalProvider } from "../../providers/modal-provider";


export default function StudentListView() {
  const { openModal } = useModalProvider();
  const openCreateModal = () => openModal(CreateStudentModal);
  
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-semibold py-3">Quản lý học viên</h2>
        <CustomButton
          onClick={openCreateModal}
          label="Tạo mới"
          icon={<PiPlus size={20} />}
        />
      </div>
      <StudentsTable />
    </>
  );
}
