import { CreateTransactionDto } from "./create-transaction.dto";

export default interface ExportManualDto extends CreateTransactionDto {
  items: {
    batch_code: string;
    quantity: number;
  }[];
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  export_date: string;
}
