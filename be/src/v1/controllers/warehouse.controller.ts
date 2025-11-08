import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import WarehouseService from "../services/warehouse.service";
import { PaginationDto } from "../cores/dtos/pagination.dto";
class WarehouseController {

  getAllWarehouseOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const paginationDto = {
      page:req.query.page || 1,
      size:req.query.size || 20
    } as PaginationDto;
    return new OK({
      message: "danh sách kho của bạn",
      data: await WarehouseService.getAllWarehouseOwn(req.user.id,paginationDto),
    }).send(res);
  };

  manualImportToWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "nhập kho cho tài sản thành công",
      data: await WarehouseService.manualImportToWarehouse(req.body),
    }).send(res);
  };
}
export default new WarehouseController();
