import { z } from "zod";
export const CreateUserSchema = z.object({
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
  phone_number: z
  .string()
  .regex(/^(0|\+84)(\d{9})$/, "Số điện thoại không hợp lệ")
  .optional(),
  role_id: z.number(),
});

export type CreateUserData = z.infer<typeof CreateUserSchema>;

export interface CreateUserDto {
  username: string;
  email: string;
  fullname: string;
  role_id: number;
  warehouse_ids?:number[];
  phone_number?:string;
}
