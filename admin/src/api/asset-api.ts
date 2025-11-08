import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import type { CreateAssetDto } from "../dtos/asset/create-asset.dto";
import type { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import api from "../libs/api";
import type { Category } from "./category-api";

type Asset = {
  id: number;
  name: string;
  description?: string;
  code: string;
  image_url?: string;
  cost: number;
  category: Category;
  status: number;
  import_date: Date;
  maintenance_due: Date;
  quantity: number;
};

class AssetApi {
  static async getAllAssets(
    paginationDto: PaginationAssetsDto | {},
  ): Promise<ApiResponseDto<ResponsePaginationDto<Asset>>> {
    const response = await api.get("/v1/assets", {
      params: paginationDto,
    });
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async addNewAsset(
    createAssetDto: CreateAssetDto,
  ): Promise<ApiResponseDto<Asset>> {
    const response = await api.post("/v1/assets", createAssetDto);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }
}
export default AssetApi;
