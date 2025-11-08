import { IBaseModelAttributes } from "../cores/base.model";

export interface Category extends IBaseModelAttributes {
  id: number;
  name: string;
  description?: string;
  color: string;
}
