import { z } from "zod";

export const UpdateAssetSchema = z.object({
  name: z
    .string()
    .min(2, "Tên tài sản phải có ít nhất 2 ký tự")
    .max(100, "Tên tài sản không được vượt quá 100 ký tự")
    .nonempty("Tên tài sản là bắt buộc"),

  category_id: z
    .number({ error: "Danh mục là bắt buộc" })
    .nonnegative("Danh mục không hợp lệ"),

  description: z
    .string()
    .max(255, "Mô tả không được vượt quá 255 ký tự")
    .optional()
    .nullable(),
});

export type UpdateAssetData = z.infer<typeof UpdateAssetSchema>;

export interface UpdateAssetDto {
  name: string;
  category_id: number;
  description?: string | null;
  image?: File;
}
