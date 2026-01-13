import { PaginationDto } from "../../cores/dtos/pagination.dto";

export default interface LogFilterPaginationDto extends PaginationDto {
  username?: string;
  action_id?: number;
  controller_id?: number;
  startDate?: string;
  endDate?: string;
}
