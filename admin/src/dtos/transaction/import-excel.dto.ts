import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from "zod";

export const ImportExcelSchema = z.object({
  received_date: z.string("received_date is required").nonempty("Ngày nhận là bắt buộc"),
  sender_location: z.string("sender_location is required").nonempty("Nơi nhận là bắt buộc")
}).extend(CreateTransactionSchema.shape);

export type ImportExcelData = z.infer<typeof ImportExcelSchema>;
export type ImportExcelFileData = z.infer<typeof ImportExcelSchema> & {
  file:File
};