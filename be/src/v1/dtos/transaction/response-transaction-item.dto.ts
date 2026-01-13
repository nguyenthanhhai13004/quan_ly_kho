
export default interface ResponseTransactionItemDto{
    asset_name:string;
    asset_code:string;
    warehouse_asset_id:number;
    quantity:number;
    cost?:number;
    // transaction_id:number;
}