import { AssetTransactionItems } from "../../models/asset-transaction-items.model";
import { AssetTransactions } from "../../models/asset-transactions.model";
import ResponseTransactionItemDto from "./response-transaction-item.dto";

export default interface ResponseTransactionsDto extends AssetTransactions{
    created_by_user:string|null
    modified_by_user:string|null,
    asset_transaction_items:ResponseTransactionItemDto[];
    return_deadline?:Date;
    allocation_date?:Date;
    return_date?:Date;
    disposal_date?:Date;
}