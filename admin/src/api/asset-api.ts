import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import type { CreateAssetDto } from "../dtos/asset/create-asset.dto";
import type { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import type { UpdateAssetDto } from "../dtos/asset/update-asset.dto";
import api from "../libs/api";
import type { TAsset } from "../types/asset.type";


class AssetApi {
  static async getAllAssets(
    paginationDto: PaginationAssetsDto | {},
  ): Promise<ApiResponseDto<ResponsePaginationDto<TAsset>>> {
    const response = await api.get("/v1/assets", {
      params: paginationDto,
    });
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getDetailAsset(assetCode: string): Promise<ApiResponseDto<TAsset>> {
    const response = await api.get(`/v1/assets/${assetCode}`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async addNewAsset(
    createAssetDto: CreateAssetDto,
  ): Promise<ApiResponseDto<TAsset>> {
    const {
      category_id,
      code,
      name,
      description,
      image,
    } = createAssetDto;
    const formData = new FormData();
    formData.append("category_id", String(category_id));
    formData.append("code", code);
    formData.append("name", name);
    formData.append("description", description || "");
    if (image) formData.append("file", image);
    const response = await api.post("/v1/assets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async updateAsset(
    assetId:number,
    updateAssetDto: UpdateAssetDto,
  ): Promise<ApiResponseDto<TAsset>> {
    const {
      category_id,
      name,
      description,
      image,
    } = updateAssetDto;
    const formData = new FormData();
    formData.append("category_id", String(category_id));
    formData.append("name", name);
    formData.append("description", description || "");
    if (image) formData.append("file", image);
    const response = await api.put(`/v1/assets/${assetId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async generateCode(category_id:number): Promise<ApiResponseDto<string>> {
    const payload = {
      category_id
    }
    const response = await api.post(`/v1/assets/generate-code`,payload);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

   static async deleteAsset(asset_id:number): Promise<ApiResponseDto<number>> {
    const response = await api.delete(`/v1/assets/${asset_id}`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }
}
export default AssetApi;
