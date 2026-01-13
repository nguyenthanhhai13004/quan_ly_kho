import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from "zod";

export const DisposalItemSchema = z.object({
  batch_code: z.string().nonempty("Mã lô là bắt buộc"),
  quantity: z.number("Số lượng là bắt buộc").min(1, "Số lượng phải lớn hơn 0"),
  cost:z.number("Giá trị phải là kiểu số"),
});

export const CreateDisposalSchema = z
  .object({
    disposal_date: z
      .string("Ngày thanh lý là bắt buộc")
      .nonempty("Ngày thanh lý là bắt buộc"),
    items: z
      .array(DisposalItemSchema)
      .nonempty("Phải có ít nhất 1 lô hàng"),
  })
  .extend(CreateTransactionSchema.shape);

export type CreateDisposalData = z.infer<typeof CreateDisposalSchema>;
