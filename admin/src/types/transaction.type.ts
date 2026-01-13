export interface TAssetTransactionItem {
  asset_name: string;
  warehouse_asset_id: number;
  quantity: number;
  asset_code: string;
  cost: number;
}

export interface TAssetTransaction {
  id: number;
  code: string;
  name: string;
  warehouse_id: number;
  type: number;
  note: string | null;
  reason: string | null;

  // for allocation transactions
  return_deadline: string | null;
  return_date: string | null;

  // ngay cap phat
  allocation_date: string | null;

  disposal_date:string|null;

  maintenance_status?:number;

  created_by_user_id: number | null;
  modified_by_user_id: number | null;
  deleted_by_user_id: number | null;

  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  deleted_at: string | null;

  created_by_user: string | null;
  modified_by_user: string | null;

  asset_transaction_items: TAssetTransactionItem[];
}

export type TBatch = {
  id: number;
  asset_id: number;
  warehouse_id: number;
  quantity: number;
  maintenance_due: string;
  status: number;
  batch_code: string;
  expiration_date: string; 
  manufacture_date: string;
  asset_code?:string|null;
  asset_name?:string|null;
  created_by_user_id: number | null;
  modified_by_user_id: number | null;
  deleted_by_user_id: number | null;
  created_at: string; 
  updated_at: string; 
  deleted_at: string | null;
}

export interface TTransactionItemAsset {
  id: number;
  code: string;
  name: string;
  warehouse_id: number;
  type: number;
  note: string | null;
  reason: string | null;
  quantity:number,
  cost:number|null,
  status:number|null
  return_deadline: string | null;
  return_date: string | null;

  // ngay cap phat
  allocation_date: string | null;

  disposal_date:string|null;

  maintenance_status?:number;
}