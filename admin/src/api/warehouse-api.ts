import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import type { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import api from "../libs/api";

type Warehouse = {
  id: number;
  name: string;
  code: string;
  address?: string;
  managers?:{id:number,fullname:string,email:string}[]
};

export type AssetStatusSummary = {
  status: number;
  quantity: number;
};

type AssetInWarehouse = {
  id: number;
  asset_code: string;
  asset_name: string;
  image_url: string;
  category: {
    name: string;
  };
  status: AssetStatusSummary[];
};

class WarehouseApi {

  static async createWarehouse(variables: any): Promise<
    ApiResponseDto<Warehouse>
  > {
    const response = await api.post("/v1/warehouses", variables);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getWarehouseOwn(): Promise<
    ApiResponseDto<ResponsePaginationDto<Warehouse>>
  > {
    const response = await api.get("/v1/warehouses/own");
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getWarehouseAny(keyword:string): Promise<
    ApiResponseDto<ResponsePaginationDto<Warehouse>>
  > {
    const response = await api.get(`/v1/warehouses/any?keyword=${keyword}`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async checkImportWarehouse(): Promise<ApiResponseDto<any>> {
    return {
      data: {},
      message: "",
      status: 200,
    };
  }

  static async getAllAssetsInWarehouseOwn(paginationDto:PaginationAssetsDto): Promise<
    ApiResponseDto<ResponsePaginationDto<AssetInWarehouse>>
  > {
    const response = await api.get("/v1/warehouses/assets",{
      params:paginationDto
    });
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }
}

export default WarehouseApi;
