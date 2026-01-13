import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../components/common/custom-modal";
import { useForm } from "react-hook-form";
import {
  ChangePasswordSchema,
  type ChangePasswordFormData,
} from "../../dtos/auth/change-password.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthApi from "../../api/auth-api";
import { toast } from "react-toastify";

export default function ChangePasswordModal({
  open,
  onClose,
}: CustomModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    const result = await AuthApi.changePassword({
      new_password: data.newPassword,
      old_password: data.oldPassword,
 });

    if (result.data) {
      toast.success(result.message, {
        hideProgressBar: true,
        autoClose: 1000,
      });
      onClose();
      reset();
    }
  };

  return (
    <CustomModal  title="Thông tin tài khoản" onClose={onClose} open={open}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[400px] flex flex-col gap-2"
      >
        <CustomInput
          placeholder="Mật khẩu cũ"
          required
          {...register("oldPassword")}
          error={errors.oldPassword?.message}
        />
        <CustomInput
          placeholder="Mật khẩu mới"
          required
          {...register("newPassword")}
          error={errors.newPassword?.message}
        />
        <CustomInput
          placeholder="Xác nhận mật khẩu mới"
          required
          {...register("confirmNewPassword")}
          error={errors.confirmNewPassword?.message}
        />
        <CustomButton className="px-3 py-2 w-full bg-linear-to-r from-[#29cefc] to-[#bc25ff] uppercase" type="submit" label="Đổi mật khẩu" size="sm" />
      </form>
    </CustomModal>
  );
}
