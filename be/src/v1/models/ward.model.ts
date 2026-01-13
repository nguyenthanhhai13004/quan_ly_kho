import { IBaseModelAttributes } from "../cores/base.model";

export interface Ward extends IBaseModelAttributes {
  id: number;
  code:string,
  name:string;
  name_en: string;
  full_name:string;
  full_name_en:string;
  code_name:string;
  province_code:string;
  administrative_unit_id:number;
}
