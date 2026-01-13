import type { PaginationDto } from "../../common/dtos/pagination.dto";

export interface PaginationTransactionsForAssetDto extends PaginationDto {
    types:number[];
}