import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import RbacService from "../services/rbac.service";

class RbacController {
  createNewRole = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "tạo role thành công",
      data: await RbacService.createNewRole({
        ...req.body,
      }),
    }).send(res);
  };

  getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "danh sách role",
      data: await RbacService.getAllRoles(),
    }).send(res);
  };

  getAllPermissons = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "danh sách permissions",
      data: await RbacService.getAllPermissions(),
    }).send(res);
  };
}
export default new RbacController();
