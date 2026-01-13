import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import UserService from "../services/user.service";
import { PaginationUsersDto } from "../dtos/user/pagination-users.dto";
import KQNLogService from "../services/log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";

class UserController {
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const query = {
      page: req.query.page || 1,
      size: req.query.size || 20,
      keyword: req.query.keyword || "",
      role: req.query.role,
      active: req.query.active,
    } as PaginationUsersDto;
    return new OK({
      message: "lấy danh sách người dùng thành công",
      data: await UserService.getAllUsers(query),
    }).send(res);
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUser(req.body);
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.USER,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });
    return new OK({
      message: "tạo người dùng thành công",
      data: result,
    }).send(res);
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "cập nhật người dùng thành công",
      data: await UserService.updateUser(
        {
          ...req.body,
          id: req.params.id,
        },
        req,
      ),
    }).send(res);
  };

  resetPasswordAny = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: LogController.USER,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });
    return new OK({
      message: "đặt lại mật khẩu thành công",
      data: await UserService.resetUserPassword(Number(req.params.id)),
    }).send(res);
  };

  getUserDetail = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "thông tin user",
      data: await UserService.getUser(Number(req.params.id)),
    }).send(res);
  };
}

export default new UserController();
