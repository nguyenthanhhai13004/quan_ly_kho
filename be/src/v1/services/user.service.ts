import { Request } from "express";
import { hashPassword } from "../auths/utils";
import { RESET_PASSWORD_USER_DEFAULT } from "../cores/constants/app.constant";
import {
  CREATE_NEW_USER_EMAIL_TEMPLATE,
  RESET_PASSWORD_USER_FROM_ADMIN_EMAIL_TEMPLATE,
} from "../cores/constants/email-template.constant";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../cores/error.response";
import { UpdateProfileOwnDto } from "../dtos/auth/update-profile-own.dto";
import { CreateUserDto } from "../dtos/user/create-user.dto";
import { PaginationUsersDto } from "../dtos/user/pagination-users.dto";
import { ResponseUserDto } from "../dtos/user/response-user.dto";
import { UpdatedUserDto } from "../dtos/user/update-user.dto";
import { User } from "../models/user.model";
import roleRepository from "../repositories/role.repository";
import userRepository from "../repositories/user.repository";
import warehouseUserRepository from "../repositories/warehouse-user.repository";
import { generateRandomPassword } from "../utils/generate-random-password";
import { getInfoData } from "../utils/get-info-data";
import { replacePlaceHolder } from "../utils/replace-placeholder";
import EmailService from "./email.service";
import KQNLogService from "./log.service";
import { getRequestInfo } from "../utils/request-info";
import { getDiffChangesArray } from "../utils/get-diff-changes";

class UserService {
  static async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    const roleFound = await roleRepository.findRoleById(createUserDto.role_id);
    if (!roleFound) {
      throw new NotFoundError("role không tìm thấy");
    }

    const isEmailTaken = await userRepository.isEmailTaken(createUserDto.email);
    if (isEmailTaken) {
      throw new BadRequestError("email đã được sử dụng");
    }

    const isUsernameTaken = await userRepository.isUsernameTaken(
      createUserDto.username,
    );
    if (isUsernameTaken) {
      throw new BadRequestError("username đã được sử dụng");
    }

    const password = generateRandomPassword();
    const passwordHash = await hashPassword(password);
    const { warehouse_ids, ...userCreateData } = {
      ...createUserDto,
      password: passwordHash,
    };
    const userStore = await userRepository.store(userCreateData);
    if (!userStore) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại.");
    }

    // store warehouses for user
    if (
      createUserDto.warehouse_ids !== undefined &&
      createUserDto.warehouse_ids.length > 0
    ) {
      await warehouseUserRepository.createMany(
        createUserDto.warehouse_ids.map((w) => ({
          user_id: userStore.id,
          warehouse_id: w,
        })),
      );
    }

    // send email
    const templateHtml = replacePlaceHolder(
      CREATE_NEW_USER_EMAIL_TEMPLATE.html,
      {
        temp_password: password,
        login_url: "",
        username: userStore.username,
      },
    );
    await EmailService.send({
      html: templateHtml,
      subject: CREATE_NEW_USER_EMAIL_TEMPLATE.title,
      text: templateHtml,
      to: userStore.email,
    });

    return getInfoData<ResponseUserDto>({
      fields: ["id", "fullname", "username", "email", "is_active"],
      object: userStore,
    });
  }
  static async updateUser(
    updateUserDto: UpdatedUserDto,
    req: Request,
  ): Promise<ResponseUserDto> {
    const userFound = await userRepository.findUserById(updateUserDto.id);

    if (!userFound) {
      throw new NotFoundError("user không tồn tại.");
    }

    if (userFound.email !== updateUserDto.email) {
      const isEmailTaken = await userRepository.isEmailTaken(
        updateUserDto.email,
      );
      if (isEmailTaken) {
        throw new BadRequestError("email đã được sử dụng");
      }
    }
    const updated = await userRepository.updateUserById(updateUserDto.id, {
      email: updateUserDto.email,
      is_active: updateUserDto.active,
      fullname: updateUserDto.fullname,
      phone_number: updateUserDto.phone_number || "",
    });

    if (!updated) {
      throw new InternalServerError("có lỗi xảy ra, thử lại sau.");
    }

    // update warehouse
    if (updateUserDto.warehouse_ids !== undefined) {
      // remove all
      await warehouseUserRepository.deleteAllByUserId(updated.id);
      if (updateUserDto.warehouse_ids.length > 0) {
        await warehouseUserRepository.createMany(
          updateUserDto.warehouse_ids.map((w) => ({
            user_id: updated.id,
            warehouse_id: w,
          })),
        );
      }
    }

    const { ip, url } = getRequestInfo(req);
    const edit_changes = getDiffChangesArray(
      {
        email: userFound.email,
        is_active: userFound.is_active,
        fullname: userFound.fullname,
      },
      {
        email: updateUserDto.email,
        is_active: updateUserDto.active,
        fullname: updateUserDto.fullname,
      },
    );
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: LogController.USER,
      username: req.user.username,
      data: req.body,
      ip,
      url,
      edit_changes,
    });

    return getInfoData<ResponseUserDto>({
      fields: ["id", "fullname", "username", "email", "is_active"],
      object: updated,
    });
  }
  static async getAllUsers(
    paginationDto: PaginationUsersDto,
  ): Promise<ResponsePaginationDto<User>> {
    const result = await userRepository.getAllUsers(paginationDto);
    return {
      ...result,
      items: result.items.map((u) =>
        getInfoData({
          fields: ["id", "fullname", "username", "email", "is_active"],
          object: u,
        }),
      ),
    };
  }
  static async getUser(userId: number): Promise<ResponseUserDto> {
    const userFound = await userRepository.findUserById(userId);
    if (!userFound) {
      throw new NotFoundError();
    }

    return getInfoData<ResponseUserDto>({
      fields: [
        "id",
        "fullname",
        "username",
        "email",
        "is_active",
        "role",
        "warehouse_ids",
        "phone_number",
      ],
      object: {
        ...userFound,
        role: userFound.role_id,
      },
    });
  }
  static async resetUserPassword(userId: number): Promise<boolean> {
    const userFound = await userRepository.findUserById(userId);

    if (!userFound) {
      throw new NotFoundError("user không tồn tại");
    }

    const password = generateRandomPassword();
    const passwordHash = await hashPassword(password);
    const updateUser = await userRepository.updateUserById(userId, {
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
}
export default UserService;
