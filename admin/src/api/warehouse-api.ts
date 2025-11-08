import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import api from "../libs/api";

type Warehouse = {
  id: number;
  name: string;
  code: string;
};

class WarehouseApi {
  static async getWarehouseOwn(): Promise<
    ApiResponseDto<ResponsePaginationDto<Warehouse>>
  > {
    const response = await api.get("/v1/warehouses");
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }
}

export default WarehouseApi;
