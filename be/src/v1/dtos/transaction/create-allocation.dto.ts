import { CreateTransactionDto } from "./create-transaction.dto";

export default interface CreateAllocationDto extends CreateTransactionDto {
    items: {
        batch_code: string;
        quantity: number;
    }[]
    allocation_date: string;
    return_deadline?: string;
    receiver_id: number;
}