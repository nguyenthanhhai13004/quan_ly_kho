import CustomTable from "../../components/common/custom-table";
import CustomBadge from "../../components/common/custom-badge";
import UserApi from "../../api/user-api";
import { toast } from "react-toastify";
import CustomIcon from "../../components/common/custom-icon";
import { RiResetLeftFill } from "react-icons/ri";
import UserFilter from "./user-filter";
import { MdBlock } from "react-icons/md";
import type { UpdateUserDto } from "../../dtos/user/update-user.dto";
import { BiEdit } from "react-icons/bi";
import { useModalProvider } from "../../providers/modal-provider";
import { ModalEnum } from "../../constants/modals.constant";
import UpdateUserModal from "./modals/update-user-modal";
import { useState } from "react";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationUsersDto } from "../../dtos/user/pagination-users.dto";
import { useDrawer } from "../../hooks/use-drawer";
import { DrawerEnum } from "../../constants/drawers.constant";
import { useUpdateUser, useUsers } from "../../queries/user.query";

const columns = [
  "STT",
  "Fullname",
  "Username",
  "Email",
  "Trạng thái",
  "Hoạt động",
];
export default function UsersTable() {
  const { mutate } = useUpdateUser();
  const { setCurrentModal,currentModal } = useModalProvider();
  const [selected, setSelected] = useState<number | null>(null);
  const {params,setParams} = usePaginationParams<PaginationUsersDto>();
  const { users } = useUsers(params);
  const {toggleFilterDrawer,drawer} = useDrawer();
  const handleResetPassword = async (userId: number) => {
    const result = await UserApi.resetPassword(userId);
    if (result.data) {
      toast.info(result.message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    } else {
      toast.error(result.message);
    }
  };
  const handleChangeActive = async (
    userId: number,
    updateUserDto: UpdateUserDto,
  ) => {
    mutate({ userId, updateUserDto, paginationDto:params });
  };
  const handlePagination = (page: number) => {
    setParams({...params,page});
  };
  return (
    <>
      <CustomTable
        onPageChange={handlePagination}
        title="D/S người dùng"
        filter={<UserFilter />}
        columns={columns}
        onDrawer={toggleFilterDrawer}
        isOpenDrawer={drawer === String (DrawerEnum.FILTER_DRAWER)}
        currentPage={params.page}
        totalPages={users?.totalPages}
        data={
          users?.items.map((s, index: number) => [
            index + 1,
            s.fullname,
            s.username,
            s.email,
            <CustomBadge
              label={s.is_active ? "Đang hoạt động" : "Không hoạt động"}
              status={s.is_active ? "success" : "error"}
            />,
            <>
              <CustomIcon
                onClick={() => handleResetPassword(s.id)}
                label="Đặt lại mật khẩu"
                icon={<RiResetLeftFill size={20} />}
              />
              <CustomIcon
                onClick={() =>
                  handleChangeActive(s.id, {
                    active: s.is_active === 1 ? 0 : 1,
                    email: s.email,
                    fullname: s.fullname,
                  })
                }
                label={s.is_active ? "Khóa tài khoản" : "Mở khóa TK"}
                icon={<MdBlock size={20} />}
              />
              ,
              <>
                <CustomIcon
                  onClick={() => {
                    setCurrentModal(ModalEnum.EDIT_USER_MODAL);
                    setSelected(s.id);
                  }}
                  label="Chỉnh sửa thông tin"
                  icon={<BiEdit size={20} />}
                />
              </>
            </>,
          ]) || []
        }
      />
      <UpdateUserModal
        userId={selected}
        onClose={() => {
          setSelected(null);
          setCurrentModal(ModalEnum.CLOSE_MODAL);
        }}
        open={currentModal === ModalEnum.EDIT_USER_MODAL}
      />
    </>
  );
}
