import { IBaseModelAttributes } from "../cores/base.model";

export interface AdministrativeUnit extends IBaseModelAttributes {
  id: number;
  full_name:string,
  full_name_en:string;
  short_name: string;
  code_name:string;
  code_name_en:string;
}
