import { z } from "zod";
import {AssetStatusEnum} from "../../common/enums/asset-status.enum";

export const CreateAssetSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Mã tài sản phải có ít nhất 2 ký tự")
    .max(50, "Mã tài sản không được vượt quá 50 ký tự")
    .nonempty("Mã tài sản là bắt buộc"),

  name: z
    .string()
    .min(2, "Tên tài sản phải có ít nhất 2 ký tự")
    .max(100, "Tên tài sản không được vượt quá 100 ký tự")
    .nonempty("Tên tài sản là bắt buộc"),

  category_id: z
    .number({ error: "Danh mục là bắt buộc" })
    .nonnegative("Danh mục không hợp lệ"),

  // warehouse_id: z
  //   .number({ error: "Kho là bắt buộc" })
  //   .nonnegative("Kho không hợp lệ"),

  description: z
    .string()
    .max(255, "Mô tả không được vượt quá 255 ký tự")
    .optional()
    .nullable(),

  quantity: z
    .number("Số lượng là bắt buộc")
    .min(0, "Số lượng không được nhỏ hơn 0"),

  cost: z
    .number("Giá trị phải là số")
    .min(0, "Giá trị không được nhỏ hơn 0")
    .optional()
    .nullable(),
  status: z.literal(Object.values(AssetStatusEnum),{error:"trạng thái không hợp lệ"}),
});

export type CreateAssetData = z.infer<typeof CreateAssetSchema>;

export interface CreateAssetDto {
  code: string;
  name: string;
  category_id: number;
  description?: string | null;
  quantity: number;
  cost?: number | null;
  status: number;
  maintenance_due?: Date | null;
  image?: string | null;
  warehouse_id: number;
}
