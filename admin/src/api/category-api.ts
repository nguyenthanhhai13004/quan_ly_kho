import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { PaginationDto } from "../common/dtos/pagination.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import api from "../libs/api";
import type { TCategory } from "../types/category.type";

class CategoryApi {
  static async getAllCategories(
    paginationDto?: PaginationDto & { keyword: string },
  ): Promise<ApiResponseDto<ResponsePaginationDto<TCategory>>> {
    const response = await api.get("/v1/categories", {
      params: paginationDto,
    });
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async createCategory(
    payload: Partial<TCategory>,
  ): Promise<ApiResponseDto<TCategory>> {
    const response = await api.post("/v1/categories", payload);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async updateCategory(
    payload: Partial<TCategory>,
  ): Promise<ApiResponseDto<TCategory>> {
    const {color,description,name} = payload;
    const response = await api.put(`/v1/categories/${payload.id}`, {
      color,
      description,
      name
    });
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async deleteCategory(id: number): Promise<ApiResponseDto<null>> {
    const response = await api.delete(`/v1/categories/${id}`);
    return {
      data: response.data.data ?? null,
      message: response.data.message,
      status: response.status,
    };
  }
}
export default CategoryApi;
