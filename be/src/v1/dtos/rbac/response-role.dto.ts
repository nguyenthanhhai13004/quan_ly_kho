import { ResponseItemDto } from "../../cores/dtos/response-item.dto";

export interface ResponseRoleDto extends ResponseItemDto{
    name:string;
    description?:string;
    permission_ids?:number[];
}