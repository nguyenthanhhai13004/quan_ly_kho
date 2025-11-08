import { ResponseItemDto } from "../../cores/dtos/response-item.dto";
export interface ResponseUserDto extends ResponseItemDto{
    id:number;
    fullname:string;
    username:string;
    email:string;
    role?:string;
    is_active?:boolean;
    permissions?:string[]
}