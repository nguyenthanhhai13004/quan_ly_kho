import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import { ResponseUserDto } from "../dtos/user/response-user.dto";
import userRepository from "../repositories/user.repository";
import { getInfoData } from "../utils/get-info-data";
import { LoginDto } from "../dtos/auth/login.dto";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../cores/error.response";
import { comparePassword, hashPassword } from "../auths/utils";
import { createKeyPair, CreateKeyPairType } from "../auths";
import { ResponseLoginDto } from "../dtos/auth/response-login.dto";
import {
  MAX_FAILED_LOGIN_ATTEMPTS,
  TIME_LOCK_FAILED,
} from "../cores/constants/app.constant";
import roleRepository from "../repositories/role.repository";
import { UpdateProfileOwnDto } from "../dtos/auth/update-profile-own.dto";
import { ChangePasswordDto } from "../dtos/auth/change-password.dto";
import { ResponseUpdateProfileOwnDto } from "../dtos/auth/response-update-profile-own.dto";
import permissionRepository from "../repositories/permission.repository";
import warehouseUserRepository from "../repositories/warehouse-user.repository";

class AccessService {
  static async login(loginDto: LoginDto): Promise<ResponseLoginDto> {
    const userFound = await userRepository.findUserByUserName(
      loginDto.username,
    );

    if (!userFound) {
      throw new NotFoundError("username hoặc mật khẩu chưa chính xác");
    }

    if (!userFound.is_active) {
      throw new UnauthorizedError("tài khoản chưa được kích hoạt");
    }

    if (
      userFound.failed_login_attempts >= MAX_FAILED_LOGIN_ATTEMPTS &&
      userFound.last_failed_login_at &&
      Date.now() - new Date(userFound.last_failed_login_at).getTime() <
        TIME_LOCK_FAILED
    ) {
      throw new BadRequestError(
        `Bạn đã nhập sai mật khẩu quá ${MAX_FAILED_LOGIN_ATTEMPTS}, thử lại sau.`,
      );
    }

    const isMatch = await comparePassword(
      loginDto.password,
      userFound.password,
    );
    if (!isMatch) {
      const failedAttempts = userFound.failed_login_attempts + 1;
      const now = new Date();
      await userRepository.updateUserById(userFound.id, {
        failed_login_attempts: failedAttempts,
        last_failed_login_at: now,
      });
      if (failedAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
        throw new BadRequestError(
          "Tài khoản tạm thời bị khóa do nhập sai quá nhiều lần.",
        );
      }
      throw new NotFoundError("username hoặc mật khẩu chưa chính xác");
    }

    const roleFound = await roleRepository.findRoleById(userFound.role_id);

    if (!roleFound) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại");
    }

    const foundWarehouses = await warehouseUserRepository.findByCondition({
      user_id:userFound.id
    });



    const tokens = await createKeyPair({
      email: userFound.email,
      id: userFound.id,
      username: userFound.username,
      role_name: roleFound.name,
      role_id: roleFound.id,
      fullname: userFound.fullname,
      warehouse_ids: foundWarehouses?.map(item => item.warehouse_id) || []
    });

    if (!tokens) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại");
    }

    return {
      user: {
        ...getInfoData({
          fields: ["id", "fullname", "username", "email"],
          object: userFound,
        }),
        role: roleFound.name,
      },
      tokens,
    };
  }

  static async updateProfleOwn(
    user: CreateKeyPairType,
    updateProfileOwnDto: UpdateProfileOwnDto,
  ): Promise<ResponseUpdateProfileOwnDto> {
    const isExitEmail = await userRepository.isEmailTaken(
      updateProfileOwnDto.email,
    );
    if (isExitEmail && user.email !== updateProfileOwnDto.email) {
      throw new BadRequestError("email đã được sử dụng, thử với email khác");
    }

    const userUpdated = await userRepository.updateUserById(user.id, {
      ...updateProfileOwnDto,
    });

    if (!userUpdated) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại");
    }

    const tokens = await createKeyPair({
      email: userUpdated.email,
      id: userUpdated.id,
      username: userUpdated.username,
      role_name: user.role_name,
      role_id: user.role_id,
      fullname: userUpdated.fullname,
    });

    if (!tokens) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại");
    }
    return {
      user: {
        ...getInfoData({
          fields: ["id", "fullname", "username", "email"],
          object: userUpdated,
        }),
        role: user.role_name,
      },
      tokens,
    };
  }

  static async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const userFound = await userRepository.findUserById(id);

    if (!userFound) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại");
    }

    const isMatch = await comparePassword(
      changePasswordDto.old_password,
      userFound.password,
    );

    if (!isMatch) {
      throw new BadRequestError("mật khẩu cũ chưa chính xác");
    }

    const newHashPassword = await hashPassword(changePasswordDto.new_password);
    const userUpdated = await userRepository.updateUserById(id, {
      password: newHashPassword,
    });

    if (!userUpdated) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại");
    }
    return true;
  }

  static async me(id: number,role:string): Promise<ResponseUserDto> {
    const userFound = await userRepository.findUserById(id);
    if (!userFound){
      throw new NotFoundError();
    }
    const permissions = await permissionRepository.findAllByRoleId(userFound.role_id);
    return getInfoData<ResponseUserDto>({
      fields: ["id", "fullname", "username", "email","role","permissions"],
      object: {
        ...userFound,
        role,
        permissions:permissions.map((p)=>p.code)
      },
    });
  }
}

export default AccessService;
