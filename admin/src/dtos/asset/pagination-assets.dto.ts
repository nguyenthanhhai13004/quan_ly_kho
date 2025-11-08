import type { PaginationDto } from "../../common/dtos/pagination.dto";

export interface PaginationAssetsDto extends PaginationDto {
    code?:string;
    name?:string;
    status?:number;
    category_id?:number;
}