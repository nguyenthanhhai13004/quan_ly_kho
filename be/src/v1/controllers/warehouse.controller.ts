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
      page: Number(req.query.page || 1),
      size: Number(req.query.size || 20),
      category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
      code: req.query.code ? String(req.query.code) : undefined,
      name: req.query.name ? String(req.query.name) : undefined,
      status: req.query.status ? Number(req.query.status) : undefined,
      ids: req.query.ids ? String(req.query.ids).split(",").map(Number) : undefined,
    } as PaginationAssetsDto & {status?:any; ids?: number[]};
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

  getAssetStockAcrossWarehouses = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const assetId = Number(req.params.asset_id);
    return new OK({
      message: "Tồn kho tài sản theo kho",
      data: await WarehouseService.getAssetStockAcrossWarehouses(assetId),
    }).send(res);
  };

  getAssetsAllocationOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "Danh sách tài sản đang sở hữu",
      data: await WarehouseService.getAssetsAllcationOwn(req.user.id),
    }).send(res);
  };

  getAllocationOrdersOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const query = {
      class_id: req.query.class_id ? Number(req.query.class_id) : undefined,
      keyword: req.query.keyword ? String(req.query.keyword) : undefined,
      start_date: req.query.start_date ? String(req.query.start_date) : undefined,
      end_date: req.query.end_date ? String(req.query.end_date) : undefined,
      page: Number(req.query.page || 1),
      size: Number(req.query.size || 5),
    };
    return new OK({
      message: "Danh sách đơn cấp phát đang sở hữu (chưa trả)",
      data: await WarehouseService.getAllocationOrdersOwn(req.user.id, query),
    }).send(res);
  };
}
export default new WarehouseController();
