export interface WarehouseAsset {
  asset_id: number;
  warehouse_id: number;
  quantity: number;
  batch_code: string;
  maintenance_due?: Date;
  expiration_date?: Date;
}
