import type { PaginationDto } from "../../common/dtos/pagination.dto";

export interface PaginationLogsDto extends PaginationDto {
  username?: string;
  action_id?: number;
  controller_id?: number;
  startDate?: string;
  endDate?: string;
}
