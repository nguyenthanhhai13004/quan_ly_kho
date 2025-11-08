import { useState } from "react";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../components/common/custom-modal";
import { useMe } from "../../hooks/auth/use-me";
import { useForm } from "react-hook-form";
import {
  ProfileUpdateSchema,
  type ProfileUpdateFormData,
} from "../../dtos/auth/profile-update.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import AuthApi from "../../api/auth-api";

export default function InfoModal({ open, onClose }: CustomModalProps) {
  const { user } = useMe();
  const [isEdit, setIsEdit] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors ,isDirty},
    reset
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      email: user?.email,
      fullname: user?.fullname,
    },
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    if (!isDirty)return;
    const result = await AuthApi.updateInfo(data);
    if (result.data) {
      setIsEdit(false);
      toast.success(result.message, {
        hideProgressBar: true,
        autoClose: 1000,
      });
      onClose();
      reset(data);
    }
  };

  if (!user) return;
  return (
    <CustomModal title="Thông tin tài khoản" onClose={onClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)} className="pt-3">
        <div className="mb-5">
          <CustomInput
            disabled
            value={user.username}
            labelType="top"
            label="Tên đăng nhập"
          />
        </div>
        <div className="mb-5">
          <CustomInput
            disabled={!isEdit}
            labelType="top"
            label="Email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        <div className="mb-5">
          <CustomInput
            disabled={!isEdit}
            labelType="top"
            label="Họ tên"
            {...register("fullname")}
            error={errors.fullname?.message}
          />
        </div>
        <div className="mb-5">
          <CustomInput
            disabled
            value={user.role}
            labelType="top"
            label="Vai trò"
          />
        </div>
        <div>
           {!isEdit ? (
            <CustomButton
              type="button"
              onClick={() => setIsEdit(true)}
              className="px-3 py-2 w-full bg-linear-to-r from-[#29cefc] to-[#bc25ff] uppercase"
              size="sm"
              label="Chỉnh sửa"
            />
          ) : (
            <CustomButton
              disabled={!isDirty}
              type="submit"
              className="px-3 py-2 w-full bg-linear-to-r from-[#29cefc] to-[#bc25ff] uppercase"
              size="sm"
              label="Lưu"
            />
          )}
        </div>
      </form>
    </CustomModal>
  );
}
