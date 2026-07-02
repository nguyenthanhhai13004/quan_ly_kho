import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import UserService from "../services/user.service";
import { PaginationUsersDto } from "../dtos/user/pagination-users.dto";
import KQNLogService from "../services/log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";

class UserController {
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const size = req.query.size ? Number(req.query.size) : 20;
    const role = req.query.role ? Number(req.query.role) : undefined;
    const active = req.query.active ? Number(req.query.active) : undefined;
    const query = {
      page: Number.isNaN(page) ? 1 : page,
      size: Number.isNaN(size) ? 20 : size,
      keyword: req.query.keyword || "",
      role: Number.isNaN(role) ? undefined : role,
      active: Number.isNaN(active) ? undefined : active,
    } as PaginationUsersDto;
    return new OK({
      message: "lấy danh sách người dùng thành công",
      data: await UserService.getAllUsers(query),
    }).send(res);
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createUser(req.body, req.file);
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
        req.file,
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
