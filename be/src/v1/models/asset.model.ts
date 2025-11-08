import { IBaseModelAttributes } from "../cores/base.model";

export interface Asset extends IBaseModelAttributes {
  id: number;
  name: string;
  description?: string;
  code: string;
  image_url?: string;
  cost: number;
  category_id:number;
  status:number;
  import_date:Date,
  maintenance_due:Date
}
