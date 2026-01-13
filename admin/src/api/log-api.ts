import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import type { PaginationLogsDto } from "../dtos/log/pagination-logs.dto";
import api from "../libs/api";
import type { LogItem } from "../types/log.type";

class LogApi {
  static async getAllLogs(pagination: PaginationLogsDto):Promise<ApiResponseDto<ResponsePaginationDto<LogItem>>> {
    const response = await api.get("/v1/logs", {
      params: pagination,
    });
    return {
      data:response.data.data,
      message:response.data.message,
      status:response.status
    }
  }
}
export default LogApi;
