import { CreateTransactionDto } from "./create-transaction.dto";

export default interface CreateDisposalDto extends CreateTransactionDto {
    items: {
        batch_code: string;
        quantity: number;
        cost: number;
    }[]
    disposal_date: string;
}