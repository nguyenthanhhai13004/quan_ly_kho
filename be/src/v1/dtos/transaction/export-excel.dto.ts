import { CreateTransactionDto } from "./create-transaction.dto";

export interface ExportExcelDto extends CreateTransactionDto {
  file?: Express.Multer.File;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  export_date: string;
}
