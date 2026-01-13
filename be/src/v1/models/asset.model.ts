import { IBaseModelAttributes } from "../cores/base.model";

export interface Asset extends IBaseModelAttributes {
  id: number;
  name: string;
  description?: string;
  code: string;
  image_url?: string;
  category_id:number;
}
