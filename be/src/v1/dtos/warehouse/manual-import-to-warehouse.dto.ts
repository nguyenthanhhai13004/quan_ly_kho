


export interface ManualImportToWarehouseDto {
  asset_id: number;
  quantity: number;
  import_date: Date;
  reason: string;
  note: string;
  warehouse_id: number;
}