import { z } from "zod";

export const UpdateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Tên category phải ít nhất 2 ký tự")
    .max(50, "Tên category tối đa 50 ký tự"),
  description: z
    .string()
    .max(200, "Mô tả tối đa 200 ký tự")
    .optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, "Color phải là hex, ví dụ #FF0000")
    .optional(),
});

export type UpdateCategoryData = z.infer<typeof UpdateCategorySchema>;
