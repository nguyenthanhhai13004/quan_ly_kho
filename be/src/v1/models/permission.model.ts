import { IBaseModelAttributes } from "../cores/base.model";

export interface Permission extends IBaseModelAttributes {
  id: number;
  code:string,
  name:string;
  description: string;
}
