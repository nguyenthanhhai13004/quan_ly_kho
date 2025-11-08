import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import type { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import api from "../libs/api";

export type Category = {
  id: number;
  name: string;
  description?: string;
  color?:string;
};

class CategoryApi {
  static async getAllCategories(
    paginationDto: PaginationAssetsDto | {},
  ): Promise<ApiResponseDto<ResponsePaginationDto<Category>>> {
    try {
      const response = await api.get("/v1/categories", {
        params: paginationDto,
      });
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error();
    }
  }
}
export default CategoryApi;
