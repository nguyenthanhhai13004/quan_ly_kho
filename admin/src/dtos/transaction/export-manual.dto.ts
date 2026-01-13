import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from "zod";

export const ExportManualItemSchema = z.object({
  batch_code: z.string().nonempty("Mã lô là bắt buộc"),
  quantity: z
    .number("Số lượng là bắt buộc")
    .min(1, "Số lượng phải lớn hơn 0"),
});

export const ExportManualSchema = z.object({
  export_date: z.string("Ngày xuất kho là bắt buộc").nonempty("Ngày xuất kho là bắt buộc"),
  receiver_name: z.string("sender_location is required").nonempty("Tên người nhận là bắt buộc"),
  receiver_phone: z.string("sender_location is required").nonempty("Số điện thoại là bắt buộc"),
  receiver_address: z.string("sender_location is required").nonempty("Địa chỉ là bắt buộc"),
  items: z
    .array(ExportManualItemSchema)
    .nonempty("Phải có ít nhất 1 lô hàng"),
}).extend(CreateTransactionSchema.shape);

export type ExportManualItemData = z.infer<typeof ExportManualItemSchema>;
export type ExportManualData = z.infer<typeof ExportManualSchema>;