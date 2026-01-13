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
import KQNLogService from "./log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { Request } from "express";
import { getClientIp, getRequestInfo } from "../utils/request-info";
import db from "../databases/init.mysql-v2";
import { User } from "../models/user.model";
import { USER_TABLE_NAME } from "../cores/constants/table-name.constant";
import { generateRandomPassword } from "../utils/generate-random-password";
import { replacePlaceHolder } from "../utils/replace-placeholder";
import { RESET_PASSWORD_USER_FROM_ADMIN_EMAIL_TEMPLATE } from "../cores/constants/email-template.constant";
import EmailService from "./email.service";

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
      // throw new BadRequestError(
      //   `Bạn đã nhập sai mật khẩu quá ${MAX_FAILED_LOGIN_ATTEMPTS}, thử lại sau.`,
      // );
      const now = Date.now();
      const lastFail = new Date(userFound.last_failed_login_at).getTime();
      const diff = now - lastFail;

      if (diff < TIME_LOCK_FAILED) {
        const remainingMs = TIME_LOCK_FAILED - diff;

        const remainingSec = Math.ceil(remainingMs / 1000);
        const minutes = Math.floor(remainingSec / 60);
        const seconds = remainingSec % 60;

        throw new BadRequestError(
          `Bạn đã nhập sai quá ${MAX_FAILED_LOGIN_ATTEMPTS} lần. 
      Vui lòng thử lại sau ${minutes} phút ${seconds} giây.`,
        );
      }
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
      user_id: userFound.id,
    });

    const tokens = await createKeyPair({
      email: userFound.email,
      id: userFound.id,
      username: userFound.username,
      role_name: roleFound.code,
      role_id: roleFound.id,
      fullname: userFound.fullname,
      warehouse_ids: foundWarehouses?.map((item) => item.warehouse_id) || [],
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
        role: roleFound.code,
      },
      tokens,
    };
  }

  static async updateProfleOwn(
    user: CreateKeyPairType,
    updateProfileOwnDto: UpdateProfileOwnDto,
    req: Request,
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

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: LogController.ACCESS,
      username: req.user.username,
      data: {},
      ip,
      url,
    });
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

  static async resetPW({
    email,
    username,
  }: {
    email: string;
    username: string;
  }): Promise<boolean> {
    const userFound = await db<User>(USER_TABLE_NAME)
      .where("username", username)
      .where("email",email)
      .first();

    if (!userFound) {
      throw new NotFoundError("Tài khoản không tồn tại trong hệ thống");
    }

    const password = generateRandomPassword();
    const passwordHash = await hashPassword(password);
    const updateUser = await userRepository.updateUserById(userFound.id, {
      password: passwordHash,
    });
    if (!updateUser) {
      throw new InternalServerError("có lỗi xảy ra, thử lại sau");
    }

    const templateHtml = replacePlaceHolder(
      RESET_PASSWORD_USER_FROM_ADMIN_EMAIL_TEMPLATE.html,
      {
        temp_password: password,
        login_url: "",
        username: updateUser.username,
      },
    );
    await EmailService.send({
      html: templateHtml,
      subject: RESET_PASSWORD_USER_FROM_ADMIN_EMAIL_TEMPLATE.title,
      text: templateHtml,
      to: updateUser.email,
    });

    return true;
  }

  static async me(id: number, role: string): Promise<ResponseUserDto> {
    const userFound = await userRepository.findUserById(id);
    if (!userFound) {
      throw new NotFoundError();
    }
    const permissions = await permissionRepository.findAllByRoleId(
      userFound.role_id,
    );
    const roleFound = await roleRepository.findRoleById(userFound.role_id);
    return getInfoData<ResponseUserDto>({
      fields: [
        "id",
        "fullname",
        "username",
        "email",
        "role",
        "permissions",
        "roleName",
        "phone_number",
      ],
      object: {
        ...userFound,
        role,
        roleName: roleFound?.name,
        permissions: permissions.map((p) => p.code),
      },
    });
  }
}

export default AccessService;
