import { PiPlus } from "react-icons/pi";
import CustomButton from "../../components/common/custom-button";
import UsersTable from "./users-table";
import CreateUserModal from "./modals/create-user-modal";
import { useModalProvider } from "../../providers/modal-provider";
import { ModalEnum } from "../../constants/modals.constant";
import CustomWrapperPermissions from "../../components/common/custom-wrapper-permissions";
import { PermissionsEnum } from "../../common/enums/permissons.enum";

export default function UserListView() {
  const { currentModal, setCurrentModal } = useModalProvider();
  const handleClose = () => setCurrentModal(ModalEnum.CLOSE_MODAL);
  const openCreateModal = () => setCurrentModal(ModalEnum.CREATE_USER_MODAL);
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-semibold py-3">Quản lý người dùng</h2>
        <CustomWrapperPermissions
          permissionsRequired={[PermissionsEnum.MANAGE_USER]}
        >
          <CustomButton
            onClick={openCreateModal}
            label="Tạo mới"
            icon={<PiPlus size={20} />}
          />
        </CustomWrapperPermissions>
      </div>
      <UsersTable />
      <>
        <CreateUserModal
          onClose={handleClose}
          open={currentModal === ModalEnum.CREATE_USER_MODAL}
        />
      </>
    </>
  );
}
