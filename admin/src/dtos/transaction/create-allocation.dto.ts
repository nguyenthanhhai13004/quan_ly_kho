import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from "zod";

export const AllocationItemSchema = z.object({
  batch_code: z.string().nonempty("Mã lô là bắt buộc"),
  quantity: z.number("Số lượng là bắt buộc").min(1, "Số lượng phải lớn hơn 0"),
});

export const CreateAllocationSchema = z
  .object({
    allocation_date: z
      .string("Ngày cấp phát là bắt buộc")
      .nonempty("Ngày cấp phát là bắt buộc"),
    receiver_id:z.number("Phải có người nhận"),
    return_deadline: z
      .string()
      .nonoptional(),
    items: z.array(AllocationItemSchema).nonempty("Phải có ít nhất 1 lô hàng"),
  })
  .extend(CreateTransactionSchema.shape);

export type CreateAllocationData = z.infer<typeof CreateAllocationSchema>;
