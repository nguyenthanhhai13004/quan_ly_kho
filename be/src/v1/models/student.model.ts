import { IBaseModelAttributes } from "../cores/base.model";

export interface Student extends IBaseModelAttributes {
  id: number;
  class_id: number;
  student_code: string;
  fullname: string;
  email: string;
  password?: string;
  phone_number?: string;
  is_active: boolean;
}
