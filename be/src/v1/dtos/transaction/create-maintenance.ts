import { CreateTransactionDto } from "./create-transaction.dto";

export default interface CreateMaintenanceDto extends CreateTransactionDto {
    items: {
        batch_code: string;
        quantity: number;
        cost:number; // chi phi bao tri
    }[]
    maintenance_date: string;
}