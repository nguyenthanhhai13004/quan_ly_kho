import { IBaseModelAttributes } from "../cores/base.model";
import UserStatusEnum from "../cores/enums/user-status.enum";

export interface User extends IBaseModelAttributes {
  id: number;
  fullname:string;
  username: string;
  email: string;
  password: string;
  failed_login_attempts:number;
  last_failed_login_at?:Date|null;
  role_id:number
  is_active:UserStatusEnum
}
