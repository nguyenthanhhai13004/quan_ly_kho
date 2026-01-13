import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import { API_URL, API_VERSION } from "../constants/api-url.constant";
import type { ChangePasswordDto } from "../dtos/auth/change-password.dto";
import type { LoginDto } from "../dtos/auth/login.dto";
import type { ProfileUpdateDto } from "../dtos/auth/profile-update.dto";
import type { ResponseLoginDto } from "../dtos/auth/response-login.dto";
import type { ResponseUserDto } from "../dtos/user/response-user.dto";
import api from "../libs/api";

class AuthApi {
  static async login(
    loginDto: LoginDto,
  ): Promise<ApiResponseDto<ResponseLoginDto>> {
    try {
      const response = await api.post(
        `/${API_VERSION.V1}/${API_URL.AUTH.LOGIN}`,
        loginDto,
      );
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async me(): Promise<ApiResponseDto<ResponseUserDto>> {
    try {
      const response = await api.get(`/${API_VERSION.V1}/${API_URL.AUTH.ME}`);
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async changePassword(changePasswordDto:ChangePasswordDto){
    try {
      const response = await api.post(`/v1/auth/change-password`,changePasswordDto);
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async updateInfo(profileUpdateDto:ProfileUpdateDto){
     try {
      const response = await api.put(`/v1/auth/info`,profileUpdateDto);
      return {
        data: response.data.data,
        message: response.data.message,
        status: response.status,
      };
    } catch (error) {
      throw new Error("error");
    }
  }

  static async resetPw({email,username}:{email:string,username:string}){
     try {
      const response = await api.post(`/v1/auth/reset-pw`,{email,username});
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
export default AuthApi;
