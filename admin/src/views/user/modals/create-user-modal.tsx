import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import {
  CreateUserSchema,
  type CreateUserData,
} from "../../../dtos/user/create-user.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAllRoles } from "../../../hooks/rbac/use-all-roles";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { useCreateUser } from "../../../hooks/user/use-create-user";
import { useModalProvider } from "../../../providers/modal-provider";
import { ModalEnum } from "../../../constants/modals.constant";
import { useUserParams } from "../../../hooks/user/use-user-params";
export default function CreateUserModal({ open, onClose }: CustomModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserData>({
    resolver: zodResolver(CreateUserSchema),
  });
  const { roles } = useAllRoles();
  const { mutate } = useCreateUser();
  const { setCurrentModal } = useModalProvider();
  const { page, size, role, keyword, active } = useUserParams();
  const paginationDto = {
    page,
    size,
    active: active ? Number(active) : undefined,
    keyword,
    role: role ? Number(role) : undefined,
  };
  const onSubmit = (data: CreateUserData) => {
    const createUserDto = {
      email: data.email,
      fullname: data.fullname,
      username: data.username,
      role_id: data.role_id,
    };
    mutate(
      {
        createUserDto,
        paginationDto,
      },
      {
        onSuccess: () => {
          setCurrentModal(ModalEnum.CLOSE_MODAL);
          reset();
        },
      },
    );
  };
  return (
    <CustomModal
      width="max-w-2xl"
      title="Tạo người dùng"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2 pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="mb-3">
            <CustomInput
              labelType="top"
              required
              {...register("username")}
              error={errors.username?.message}
              placeholder="abcefd"
              label="Tên đăng nhập"
            />
          </div>
          <div className="mb-3">
            <CustomInput
              labelType="top"
              required
              {...register("email")}
              error={errors.email?.message}
              placeholder="user@example.com"
              label="Email"
            />
          </div>
          <div className="mb-3">
            <CustomInput
              labelType="top"
              required
              {...register("fullname")}
              error={errors.fullname?.message}
              placeholder="Nguyen Van A"
              label="Họ tên"
            />
          </div>
          <div className="mb-3">
            <div className="grid grid-cols-2">
              <CustomSelect
                register={register("role_id", {
                  required: true,
                  valueAsNumber: true,
                })}
                required
                error={errors.role_id?.message}
                labelType="top"
                label="Quyền"
                options={
                  roles?.map((r) => ({ label: r.name, value: r.id })) || []
                }
              />
              {/* <CustomSelect
              label="Kho quản lý"
              labelType="top"
              // required
              options={
                roles?.map((r) => ({ label: r.name, value: r.id })) || []
              }
            /> */}
            </div>
          </div>
        </div>
        <div className="text-right">
          <CustomButton type="submit" label="Tạo mới" size="sm" />
        </div>
      </form>
    </CustomModal>
  );
}
