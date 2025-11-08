import { PaginationDto } from "../../cores/dtos/pagination.dto";

export interface PaginationAssetsDto extends PaginationDto {
    code?:string;
    name?:string;
    status?:number;
    category_id?:number;
}