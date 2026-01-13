import type { PaginationDto } from "../../common/dtos/pagination.dto";

export interface PaginationTransactionsDto extends PaginationDto {
    types:number[];
    code?:string;
    created_by_user_id?:number;
    from_date?:string;
    to_date?:string;
    asset_code?:string;
}