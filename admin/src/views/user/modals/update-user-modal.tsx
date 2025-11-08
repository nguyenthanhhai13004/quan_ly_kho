import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAllRoles } from "../../../hooks/rbac/use-all-roles";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { useModalProvider } from "../../../providers/modal-provider";
import { ModalEnum } from "../../../constants/modals.constant";
import { useUserProvider } from "../../../providers/user-provider";
import { useUser } from "../../../hooks/user/use-user";
import { useEffect } from "react";
import {
  UpdateUserSchema,
  type UpdateUserData,
} from "../../../dtos/user/update-user.dto";
import { useUpdateUser } from "../../../hooks/user/use-update-user";
import { useUserParams } from "../../../hooks/user/use-user-params";

export default function UpdateUserModal({ open, onClose }: CustomModalProps) {
  const { selected } = useUserProvider();
  const { roles } = useAllRoles();
  const { user } = useUser(selected || 0);
  const { page, size, role, keyword, active } = useUserParams();
  const paginationDto = {
    page,
    size,
    active: active ? Number(active) : undefined,
    keyword,
    role: role ? Number(role) : undefined,
  };
  const {
    register,
    handleSubmit,
    formState: { errors ,isDirty},
    reset,
    getValues,
  } = useForm<UpdateUserData>({
    resolver: zodResolver(UpdateUserSchema),
  });
  const { mutate } = useUpdateUser();
  const { setCurrentModal } = useModalProvider();
  const onSubmit = (data: UpdateUserData) => {
    if (!selected) return;
    mutate(
      {
        userId: selected,
        updateUserDto: {
          active:data.active,
          email:data.email,
          fullname:data.fullname
        },
        paginationDto,
      },
      {
        onSuccess: () => {
          setCurrentModal(ModalEnum.CLOSE_MODAL);
        },
      },
    );
  };

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || "",
        fullname: user.fullname || "",
        username: user.username || "",
        role_id: user.role,
        active: user.is_active,
      });
    }
  }, [user, reset]);

  return (
    <CustomModal
      width="max-w-2xl"
      title="Cập nhật người dùng"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2 pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="mb-3">
            <CustomInput
              disabled
              labelType="top"
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
                value={getValues("role_id")}
                error={errors.role_id?.message}
                labelType="top"
                label="Quyền"
                options={
                  roles?.map((r) => ({ label: r.name, value: r.id })) || []
                }
                disabled
              />
              <CustomSelect
                register={register("active", {
                  required: true,
                  valueAsNumber: true,
                })}
                required
                error={errors.active?.message}
                labelType="top"
                label="Trạng thái"
                options={[
                  { label: "Active", value: "1" },
                  { label: "Inactive", value: "0" },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="text-right">
          <CustomButton disabled={!isDirty} type="submit" label="Cập nhật" size="sm" />
        </div>
      </form>
    </CustomModal>
  );
}
