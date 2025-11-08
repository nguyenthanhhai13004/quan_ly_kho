import { IBaseModelAttributes } from "../cores/base.model";

export interface Warehouse extends IBaseModelAttributes {
  id: number;
  name: string;
  code: string;
}
