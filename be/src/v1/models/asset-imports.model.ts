import { IBaseModelAttributes } from "../cores/base.model";

export interface AssetTransactions extends IBaseModelAttributes {
  id: number;
  received_date:Date;
  sender_location:Date;
}
