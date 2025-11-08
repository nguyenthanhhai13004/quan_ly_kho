import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().nonempty("Mật khẩu cũ không được để trống"),

    newPassword: z
      .string()
      .regex(
        passwordRegex,
        "Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số",
      )
      .nonempty("Mật khẩu mới không được để trống"),

    confirmNewPassword: z
      .string()
      .nonempty("Vui lòng nhập lại mật khẩu mới để xác nhận"),
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: "Mật khẩu mới không được trùng với mật khẩu cũ",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export interface ChangePasswordDto {
  old_password: string;
  new_password: string;
}
