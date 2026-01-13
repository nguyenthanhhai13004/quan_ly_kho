import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import type { CreateUserDto } from "../dtos/user/create-user.dto";
import type { PaginationUsersDto } from "../dtos/user/pagination-users.dto";
import type { UpdateUserDto } from "../dtos/user/update-user.dto";
import api from "../libs/api";

type User = {
  id: number;
  fullname: string;
  username: string;
  email: string;
  is_active: number;
  role:number;
  created_at: Date;
  updated_at: Date | null;
  modified_by_user_id: number | null;
  deleted_by_user_id: number | null;
  created_by_user_id: number | null;
  warehouse_ids?:number[];
  phone_number?:string;
};

class UserApi {
  static async getAllUsers(
    paginationDto: PaginationUsersDto | {},
  ): Promise<ApiResponseDto<ResponsePaginationDto<User>>> {
    try {
      const response = await api.get("/v1/users", {
        params: paginationDto,
      });
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async resetPassword(userId: number): Promise<ApiResponseDto<boolean>> {
    try {
      const response = await api.post(`/v1/users/${userId}/reset-password`);
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      return {
        data: false,
        message: "",
        status: 300,
      };
    }
  }

  static async updateUser(userId:number,updateUserDto:UpdateUserDto){
    try {
      const response = await api.put(`/v1/users/${userId}`,updateUserDto);
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async addNewUser(createUserDto:CreateUserDto):Promise<ApiResponseDto<User>>{
     try {
      const response = await api.post(`/v1/users`,createUserDto);
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async getDetailUser(userId:number):Promise<ApiResponseDto<User>>{
    try {
      const response = await api.get(`/v1/users/${userId}`);
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }
}

export default UserApi;
