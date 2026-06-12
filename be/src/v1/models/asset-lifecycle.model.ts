import { IBaseModelAttributes } from "../cores/base.model";

export interface AssetLifecycle extends IBaseModelAttributes {
  id: number;
  transaction_id: number;
  allocation_date?: string | Date | null;
  return_deadline?: string | Date | null;
  return_date?: string | Date | null;
  receiver_id?: number | null;
}
