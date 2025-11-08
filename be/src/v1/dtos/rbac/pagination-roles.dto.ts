import { PaginationDto } from "../../cores/dtos/pagination.dto";

export interface PaginationRolesDto extends PaginationDto {
    keyword?:string;
}