import { PaginationDto } from "../../cores/dtos/pagination.dto";

export interface PaginationAssetsDto extends PaginationDto {
    code?:string;
    name?:string;
    category_id?:number;
}