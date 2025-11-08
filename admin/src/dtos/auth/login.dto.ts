import { z } from "zod";
export const LoginSchema = z.object({
  username: z.string().nonempty("username không được để trống"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export interface LoginDto {
  username: string;
  password: string;
}
