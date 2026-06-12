import { IBaseModelAttributes } from "../cores/base.model";

export interface Major extends IBaseModelAttributes {
  id: number;
  name: string;
  code: string;
  description?: string;
}
