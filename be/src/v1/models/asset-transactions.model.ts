import { IBaseModelAttributes } from "../cores/base.model";

export interface AssetTransactions extends IBaseModelAttributes {
  id: number;
  name: string;
  code: string;
  warehouse_id: number;
  type:number;
  note:string|null;
  reason:string|null;
}
