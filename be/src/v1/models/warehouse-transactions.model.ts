import { IBaseModelAttributes } from "../cores/base.model";

export interface WarehouseTransactions extends IBaseModelAttributes{
    id:number;
    warehouse_id:number;
    asset_id:number;
    reason?:string;
    note?:string;
}