import { IBaseModelAttributes } from "../cores/base.model";

export interface AssetMaintenances extends IBaseModelAttributes {
  id: number;
  maintenance_date:Date;
  status:number;
  transaction_id:number;
}
