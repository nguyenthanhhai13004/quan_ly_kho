import { PaginationDto } from "../../cores/dtos/pagination.dto";

export interface PaginationUsersDto extends PaginationDto {
    keyword?:string;
    active?:number;
    role?:number;
}