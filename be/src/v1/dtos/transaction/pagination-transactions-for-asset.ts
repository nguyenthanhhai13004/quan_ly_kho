import { PaginationDto } from "../../cores/dtos/pagination.dto";

export interface PaginationTransactionsForAssetDto extends PaginationDto {
    types:number[];
    asset_code:string;
    warehouse_id:number;
}