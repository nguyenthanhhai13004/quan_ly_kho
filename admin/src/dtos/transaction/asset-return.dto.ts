import { z } from "zod";
export const ReturnItemSchema = z.object({
  batch_code: z.string().nonempty("Mã lô là bắt buộc"),

  status: z
    .number()
});

export const AssetReturnSchema = z.object({
  return_date: z.string().nonempty("Ngày thu hồi là bắt buộc"),

  items: z.array(ReturnItemSchema).nonempty("Phải có ít nhất 1 lô hàng"),
});

export type ReturnItemData = z.infer<typeof ReturnItemSchema>;
export type AssetReturnData = z.infer<typeof AssetReturnSchema>;
