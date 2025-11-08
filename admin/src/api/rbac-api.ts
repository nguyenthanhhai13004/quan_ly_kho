import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import api from "../libs/api";

type Role = {
  id: number;
  name: string;
  permission_ids?:number[]
};

type Permission = {
    id:number;
    code:string;
    name:string;
}

class RbacApi {
  static async getAllRoles(): Promise<ApiResponseDto<Role[]>> {
    try {
      const response = await api.get("/v1/rbac/roles");
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async getAllPermissions(): Promise<ApiResponseDto<Permission[]>> {
    try {
      const response = await api.get("/v1/rbac/permissions");
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

export default RbacApi;
