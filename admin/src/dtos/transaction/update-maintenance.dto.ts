import { z } from "zod";
export const UpdateMaintenaceItemSchema = z.object({
  batch_code: z.string().nonempty("Mã lô là bắt buộc"),
  status: z
    .number()
});

export const UpdateMaintenanceSchema = z.object({
//   return_date: z.string().nonempty("Ngày thu hồi là bắt buộc"),
  items: z.array(UpdateMaintenaceItemSchema).nonempty("Phải có ít nhất 1 lô hàng"),
});

export type UpdateMaintenaceItemData = z.infer<typeof UpdateMaintenaceItemSchema>;
export type UpdateMaintenaceData = z.infer<typeof UpdateMaintenanceSchema>;
