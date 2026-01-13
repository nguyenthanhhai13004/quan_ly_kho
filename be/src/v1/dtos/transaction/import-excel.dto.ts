import { CreateTransactionDto } from "./create-transaction.dto";

export interface ImportExcelDto extends CreateTransactionDto{
  file?: Express.Multer.File;
  received_date:Date;
  sender_location:string;
}
