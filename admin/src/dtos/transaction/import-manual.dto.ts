import { CreateTransactionSchema } from "./create-transaction.dto";
import { z } from "zod";

export const ImportManualItemSchema = z.object({
  batch_code: z.string().optional(),
  asset_id: z.number("asset_id is required"),
  quantity: z
    .number("quantity is required")
    .min(1, "quantity must be at least 1"),
  cost: z.number().optional(),
  manufacture_date: z.string().optional(),
  expiration_date: z.string().optional(),
  maintenance_due: z.string().optional(),
});

export const ImportManualSchema = z.object({
  received_date: z.string("received_date is required").nonempty("Ngày nhận là bắt buộc"),
  sender_location: z.string("sender_location is required").nonempty("Nơi nhận là bắt buộc"),
  items: z
    .array(ImportManualItemSchema)
    .nonempty("At least one item is required"),
}).extend(CreateTransactionSchema.shape);

export type ImportManualItemData = z.infer<typeof ImportManualItemSchema>;
export type ImportManualData = z.infer<typeof ImportManualSchema>;