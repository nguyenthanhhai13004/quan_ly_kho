import { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { OK } from "../cores/success.response";
import { LoginDto } from "../dtos/auth/login.dto";
import { UpdateProfileOwnDto } from "../dtos/auth/update-profile-own.dto";
import { ChangePasswordDto } from "../dtos/auth/change-password.dto";

class AccessController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "đăng nhập thành công",
      data: await AccessService.login(req.body as LoginDto),
    }).send(res);
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "thông tin người dùng",
      data: await AccessService.me(req.user.id,req.user.role_name),
    }).send(res);
  };

  updateProfileOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "Cập nhật thông tin thành công",
      data: await AccessService.updateProfleOwn(
        req.user,
        req.body as UpdateProfileOwnDto,
      ),
    }).send(res);
  };

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "Thay đổi mật khẩu thành công",
      data: await AccessService.changePassword(req.user.id,req.body as ChangePasswordDto),
    }).send(res);
  };
}

export default new AccessController();
