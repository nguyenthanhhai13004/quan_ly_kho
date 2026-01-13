import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import WarehouseService from "../services/warehouse.service";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { HEADERS } from "../cores/constants/headers.constants";
import { PaginationAssetsInWHDto } from "../dtos/warehouse/pagination-assets-in-wh";
import { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
class WarehouseController {
  getAllWarehouseOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const paginationDto = {
      page: req.query.page || 1,
      size: req.query.size || 20,
    } as PaginationDto;
    return new OK({
      message: "danh sách kho của bạn",
      data: await WarehouseService.getAllWarehouseOwn(
        req.user.id,
        paginationDto,
      ),
    }).send(res);
  };

  getAllWarehouseAny = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const paginationDto = {
      page: req.query.page || 1,
      size: req.query.size || 20,
      keyword:req.query.keyword || ""
    } as PaginationDto & {keyword?:string};
    return new OK({
      message: "danh sách kho",
      data: await WarehouseService.getAllWarehouseAny(paginationDto),
    }).send(res);
  };

  getDetailBatch = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "batch chi tiết",
      data: await WarehouseService.getDetailBatch(req.params.batch_code),
    }).send(res);
  };

  getAllPatchByAssetInWHOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers[HEADERS.X_WAREHOUSE_ID] as string);
    return new OK({
      message: "batch chi tiết",
      data: await WarehouseService.getAllBatchesByAssetCodeInWarehouseOwn(
        req.params.asset_code,
        warehouse_id,
      ),
    }).send(res);
  };

  // get all asset in warehouse
  getAllAssetsInWarehouseOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers[HEADERS.X_WAREHOUSE_ID] as string);
    const query = {
      page: req.query.page || 1,
      size: req.query.size || 20,
      category_id: req.query.category_id,
      code: req.query.code,
      name: req.query.name,
    } as PaginationAssetsDto;
    return new OK({
      message: "danh sách tài sản trong kho",
      data: await WarehouseService.getAllAssetsInWarehouseOwn(
        query,
        warehouse_id,
      ),
    }).send(res);
  };

  getAllBatchesNeedMaintenanceInWarehouseOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers[HEADERS.X_WAREHOUSE_ID] as string);
    return new OK({
      message: "danh sách tài sản trong kho",
      data: await WarehouseService.getAllBatchesNeedMaintenanceInWHOwn(
        warehouse_id,
      ),
    }).send(res);
  };

  createWarehouse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "Tạo kho thành công",
      data: await WarehouseService.createWarehouse({
        ...req.body,
        userId:req.user.id,
      }),
    }).send(res);
  };

}
export default new WarehouseController();
