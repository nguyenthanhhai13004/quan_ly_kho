import { IBaseModelAttributes } from "../cores/base.model";

export interface Class extends IBaseModelAttributes {
  id: number;
  major_id: number;
  name: string;
  code: string;
  description?: string;
}
