import { z } from "zod";
export const UpdateUserSchema = z.object({
   username: z
    .string()
    .min(6, "Username phải có ít nhất 6 ký tự")
    .max(20, "Username không được vượt quá 20 ký tự")
    .nonempty("Username không được để trống"),
  email: z
    .string()
    .nonempty("Email không được để trống")
    .email("Email không hợp lệ"),

  fullname: z.string().nonempty("Họ tên không được để trống"),
  active: z.number(),
   role_id: z.number(),
});

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;

export interface UpdateUserDto {
  email: string;
  fullname: string;
  active:number;
}
