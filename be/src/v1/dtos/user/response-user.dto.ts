import { ResponseItemDto } from "../../cores/dtos/response-item.dto";
export interface ResponseUserDto extends ResponseItemDto{
    id:number;
    fullname:string;
    username:string;
    email:string;
    role?:string;
    roleName?:string;
    is_active?:boolean;
    permissions?:string[],
    warehouse_ids?:number;
    phone_number?:string;
    class_id?:number|null;
    major_id?:number|null;
    avatar_url?:string|null;
}