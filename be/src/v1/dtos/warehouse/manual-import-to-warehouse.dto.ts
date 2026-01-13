


export interface ManualImportToWarehouseDto {
  asset_code: string;
  quantity: number;
  import_date: Date;
  reason: string;
  note: string;
  location_code?:string;
}