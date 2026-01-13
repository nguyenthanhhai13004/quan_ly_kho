import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import api from "../libs/api";

export type TStatsAssetsByCategory = {
  id: number;
  label: string;
  value: number;
};

export type TTrendData = {
  id: string;
  data: { x: string; y: number }[];
};

export type TDataStatus = {
  status: string;
  count: number;
};

export type TAssetStats = {
  total_assets_in_warehouse: number;
  total_allocated: number;
  total_need_maintenance: number;
};

class StatsApi {
  static async getStatsAssetsByCategory(): Promise<
    ApiResponseDto<TStatsAssetsByCategory[]>
  > {
    const response = await api.get("/v1/stats/assets/by-category");
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getStatsImportExportWHOwn(): Promise<
    ApiResponseDto<TTrendData[]>
  > {
    const response = await api.get("/v1/stats/import-export");
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getStatsAssetByStatus(): Promise<ApiResponseDto<TDataStatus[]>> {
    const response = await api.get("/v1/stats/assets/by-status");
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getStatsAsset(): Promise<ApiResponseDto<TAssetStats>> {
    const response = await api.get("/v1/stats/assets/statistics");
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }
}
export default StatsApi;
