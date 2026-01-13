import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from "zod";

export const ExportExcelSchema = z.object({
  export_date: z.string("Ngày xuất kho là bắt buộc").nonempty("Ngày xuất kho là bắt buộc"),
  receiver_name: z.string("sender_location is required").nonempty("Tên người nhận là bắt buộc"),
  receiver_phone: z.string("sender_location is required").nonempty("Số điện thoại là bắt buộc"),
  receiver_address: z.string("sender_location is required").nonempty("Địa chỉ là bắt buộc"),
}).extend(CreateTransactionSchema.shape);

export type ExportExcelData = z.infer<typeof ExportExcelSchema>;
export type ExportExcelFileData = z.infer<typeof ExportExcelSchema> & {
  file:File
};