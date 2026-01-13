import { CreateTransactionDto } from "./create-transaction.dto";

export interface ImportManualItemDto {
  batch_code?: string;
  asset_id: string;
  quantity: number;
  cost?: number;
  manufacture_date?: string;
  expiration_date?: string;
  maintenance_due?: string;
}

export default interface ImportManualDto extends CreateTransactionDto{
  received_date: string;
  sender_location: string;
  reason?: string;
  note?: string;

  warehouse_id: number;
  items: ImportManualItemDto[];
}
