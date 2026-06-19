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
  class_id?:number|null;
  major_id?:number|null;
  avatar_url?:string|null;
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
    const formData = new FormData();
    formData.append("fullname", updateUserDto.fullname);
    formData.append("email", updateUserDto.email);
    formData.append("active", String(updateUserDto.active));
    if (updateUserDto.phone_number) {
      formData.append("phone_number", updateUserDto.phone_number);
    }
    if (updateUserDto.class_id !== undefined && updateUserDto.class_id !== null) {
      formData.append("class_id", String(updateUserDto.class_id));
    }
    if (updateUserDto.major_id !== undefined && updateUserDto.major_id !== null) {
      formData.append("major_id", String(updateUserDto.major_id));
    }
    if (updateUserDto.warehouse_ids) {
      updateUserDto.warehouse_ids.forEach((id) => {
        formData.append("warehouse_ids[]", String(id));
      });
    }
    if (updateUserDto.avatar) {
      formData.append("file", updateUserDto.avatar);
    }
    try {
      const response = await api.put(`/v1/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  static async addNewUser(createUserDto:CreateUserDto):Promise<ApiResponseDto<User>>{
    const formData = new FormData();
    formData.append("username", createUserDto.username);
    formData.append("fullname", createUserDto.fullname);
    formData.append("email", createUserDto.email);
    formData.append("role_id", String(createUserDto.role_id));
    if (createUserDto.phone_number) {
      formData.append("phone_number", createUserDto.phone_number);
    }
    if (createUserDto.class_id !== undefined && createUserDto.class_id !== null) {
      formData.append("class_id", String(createUserDto.class_id));
    }
    if (createUserDto.major_id !== undefined && createUserDto.major_id !== null) {
      formData.append("major_id", String(createUserDto.major_id));
    }
    if (createUserDto.warehouse_ids) {
      createUserDto.warehouse_ids.forEach((id) => {
        formData.append("warehouse_ids[]", String(id));
      });
    }
    if (createUserDto.avatar) {
      formData.append("file", createUserDto.avatar);
    }
    try {
      const response = await api.post(`/v1/users`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
