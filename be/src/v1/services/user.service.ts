import { hashPassword } from "../auths/utils";
import { RESET_PASSWORD_USER_DEFAULT } from "../cores/constants/app.constant";
import {
  CREATE_NEW_USER_EMAIL_TEMPLATE,
  RESET_PASSWORD_USER_FROM_ADMIN_EMAIL_TEMPLATE,
} from "../cores/constants/email-template.constant";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
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
import { generateRandomPassword } from "../utils/generate-random-password";
import { getInfoData } from "../utils/get-info-data";
import { replacePlaceHolder } from "../utils/replace-placeholder";
import EmailService from "./email.service";

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
    const userCreateData = {
      ...createUserDto,
      password: passwordHash,
    };
    const userStore = await userRepository.store(userCreateData);

    if (!userStore) {
      throw new InternalServerError("có lỗi xảy ra, vui lòng thử lại.");
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
      fields: ["id", "fullname", "username", "email","is_active"],
      object: userStore,
    });
  }
  static async updateUser(
    updateUserDto: UpdatedUserDto,
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
    });

    if (!updated) {
      throw new InternalServerError("có lỗi xảy ra, thử lại sau.");
    }

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
      fields: ["id", "fullname", "username", "email","is_active","role"],
      object: {
        ...userFound,
        role:userFound.role_id
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
