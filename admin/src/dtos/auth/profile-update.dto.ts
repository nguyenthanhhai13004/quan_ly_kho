import { z } from "zod";
export const ProfileUpdateSchema = z.object({
  email: z
    .string()
    .nonempty("Email không được để trống")
    .email("Email không hợp lệ"),

  fullname: z.string().nonempty("Họ tên không được để trống"),
  phone_number: z.string().nonempty("Số điện thoại không được bỏ trống"),
});

export type ProfileUpdateFormData = z.infer<typeof ProfileUpdateSchema>;

export interface ProfileUpdateDto {
  fullname: string;
  email: string;
  phone_number?:string;
}
