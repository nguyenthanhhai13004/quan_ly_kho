import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import AdministrativeService from "../services/administrative.service";

class AdministrativeController {
  getAllProvinces = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "danh sách",
      data: await AdministrativeService.getAllProvinces(),
    }).send(res);
  };

  getWardsByProvince = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "lấy danh sách xã/phường thành công",
      data: await AdministrativeService.getWardsByProvince(req.params.provinceCode),
    }).send(res);
  };
}
export default new AdministrativeController();
