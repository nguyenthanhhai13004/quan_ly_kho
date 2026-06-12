import { CreateTransactionDto } from "./create-transaction.dto";

export default interface CreateAllocationDto extends CreateTransactionDto {
    items: {
        batch_code: string;
        quantity: number;
    }[]
    allocation_date: string;
    return_deadline?: string;
    receiver_id: number;
    // Optional checks when fulfilling an advisor request:
    // ensure the selected batches belong to the requested asset and the
    // total allocated quantity matches the requested quantity.
    expected_asset_id?: number;
    expected_quantity?: number;
}