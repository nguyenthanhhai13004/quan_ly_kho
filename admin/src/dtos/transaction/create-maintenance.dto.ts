import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from "zod";

export const CreateMaintenanceItemSchema = z.object({
  batch_code: z.string().nonempty("Mã lô là bắt buộc"),
  quantity: z.number("Số lượng là bắt buộc").min(1, "Số lượng phải lớn hơn 0"),
  cost:z.number("Giá trị phải là kiểu số"),
});

export const CreateMaintenanceSchema = z
  .object({
    maintenance_date: z
      .string("Ngày bảo trì là bắt buộc")
      .nonempty("Ngày bảo trì là bắt buộc"),
    items: z.array(CreateMaintenanceItemSchema).nonempty("Phải có ít nhất 1 lô hàng"),
  })
  .extend(CreateTransactionSchema.shape);

export type CreateMaintenanceData = z.infer<typeof CreateMaintenanceSchema>;