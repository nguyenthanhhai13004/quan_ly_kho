import { IBaseModelAttributes } from "../cores/base.model";

export interface AssetTransactionItems extends IBaseModelAttributes {
  id: number;
  warehouse_asset_id: number;
  transaction_id: number;
  quantity?:number;
  cost?:number;
  status?:number;
}
