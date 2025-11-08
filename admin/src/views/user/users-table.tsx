import CustomTable from "../../components/common/custom-table";
import { useUsers } from "../../hooks/user/use-users";
import CustomBadge from "../../components/common/custom-badge";
import { useUserParams } from "../../hooks/user/use-user-params";
import UserApi from "../../api/user-api";
import { toast } from "react-toastify";
import CustomIcon from "../../components/common/custom-icon";
import { RiResetLeftFill } from "react-icons/ri";
import UserFilter from "./user-filter";
import { MdBlock } from "react-icons/md";
import type { UpdateUserDto } from "../../dtos/user/update-user.dto";
import { useUpdateUser } from "../../hooks/user/use-update-user";
import { BiEdit } from "react-icons/bi";
import { useModalProvider } from "../../providers/modal-provider";
import { ModalEnum } from "../../constants/modals.constant";
import { useUserProvider } from "../../providers/user-provider";
import { useSearchParams } from "react-router-dom";

const columns = [
  "STT",
  "Fullname",
  "Username",
  "Email",
  "Trạng thái",
  "Hoạt động",
];
export default function UsersTable() {
  const { page, size, role, keyword, active, drawer } = useUserParams();
  const { mutate } = useUpdateUser();
  const { setCurrentModal } = useModalProvider();
  const { setSelected } = useUserProvider();
  const [searchParams, setSearchParams] = useSearchParams();
  const paginationDto = {
    page,
    size,
    active: active ? Number(active) : undefined,
    keyword,
    role: role ? Number(role) : undefined,
  };
  const params: Record<string, string> = {
    page: page.toString(),
    active: active?.toString() || "",
    keyword,
    role,
    drawer:drawer?.toString()
  };
  const { users } = useUsers(paginationDto);
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
    mutate({ userId, updateUserDto, paginationDto });
  };
  const handlePagination = (page: number) => {
    setSearchParams({
      ...params,
      page:page.toString()
    });
  };
  const handleDrawer = () => {
    setSearchParams({
      ...params,
      drawer: !drawer ? "1":""
    });
  };
  return (
    <CustomTable
      isOpenDrawer={Boolean(drawer)}
      onDrawer={handleDrawer}
      onPageChange={handlePagination}
      title="D/S người dùng"
      filter={<UserFilter />}
      columns={columns}
      currentPage={page}
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
  );
}
