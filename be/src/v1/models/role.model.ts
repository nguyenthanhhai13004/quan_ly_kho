import { IBaseModelAttributes } from "../cores/base.model";

export interface Role extends IBaseModelAttributes {
  id: number;
  name:string;
  description: string;
  permission_ids?:number[];
}
