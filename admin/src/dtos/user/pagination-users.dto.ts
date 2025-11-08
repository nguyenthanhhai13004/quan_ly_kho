import type { PaginationDto } from "../../common/dtos/pagination.dto";

export interface PaginationUsersDto extends PaginationDto {
    keyword?:string;
    active?:number;
    role?:number;
}