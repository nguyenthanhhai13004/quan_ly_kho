import { NextFunction, Request, Response } from "express";
import StudentAuthService from "../services/student-auth.service";
import { OK } from "../cores/success.response";
import { LoginDto } from "../dtos/auth/login.dto";
import { getRequestInfo } from "../utils/request-info";
import KQNLogService from "../services/log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";

class StudentAuthController {
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await StudentAuthService.login(req.body as LoginDto);
      const { ip, url } = getRequestInfo(req);
      await KQNLogService.createLog({
        action_code: LogAction.ACCOUNT,
        controller_code: LogController.ACCESS,
        username: req.body?.username || "",
        data: {},
        ip,
        url,
      });
      new OK({
        message: "Đăng nhập thành công",
        data: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: "Thông tin học viên",
        data: await StudentAuthService.me(req.user.id),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: "Cập nhật thông tin thành công",
        data: await StudentAuthService.updateProfile(req.user.id, req.body),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await StudentAuthService.changePassword(req.user.id, req.body);
      new OK({
        message: "Đổi mật khẩu thành công",
        data: "",
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new StudentAuthController();
