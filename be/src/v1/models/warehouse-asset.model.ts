import { IBaseModelAttributes } from "../cores/base.model";

export interface WarehouseAsset extends IBaseModelAttributes {
  id: number;
  asset_id: number;
  warehouse_id: number;
  quantity: number;
  batch_code: string;
  maintenance_due?: Date;
  expiration_date?: Date;
}
