import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import CategoryService from "../services/category.service";
import AssetService from "../services/asset.service";
import { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import { HEADERS } from "../cores/constants/headers.constants";
import WarehouseService from "../services/warehouse.service";
import { getRequestInfo } from "../utils/request-info";
import KQNLogService from "../services/log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";

class AssetController {
  getAllAssets = async (req: Request, res: Response, next: NextFunction) => {
    const query = {
      page: req.query.page || 1,
      size: req.query.size || 20,
      category_id: req.query.category_id,
      code: req.query.code,
      name: req.query.name,
    } as PaginationAssetsDto;
    return new OK({
      message: "danh sách tài sản",
      data: await AssetService.getAllAssets(query),
    }).send(res);
  };

  createAsset = async (req: Request, res: Response, next: NextFunction) => {
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.ASSET,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });
    return new OK({
      message: "tạo tài sản thành công",
      data: await AssetService.addNewAsset(req.user.id, {
        ...req.body,
        file: req.file,
      }),
    }).send(res);
  };

  updateAsset = async (req: Request, res: Response, next: NextFunction) => {
    const warehouse_id = req.headers[HEADERS.X_WAREHOUSE_ID] as string;
    return new OK({
      message: "cập nhật tài sản thành công",
      data: await AssetService.updateAsset(
        req.user.id,
        Number(req.params.id),
        Number(warehouse_id),
        {
          ...req.body,
          file:req.file
        },
        req,
      ),
    }).send(res);
  };

  deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.DELETE,
      controller_code: LogController.ASSET,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });
    const warehouse_id = Number(req.headers[HEADERS.X_WAREHOUSE_ID] as string);
    return new OK({
      message: "xóa tài sản thành công",
      data: await AssetService.deleteAsset((Number(req.params.id)|| 0), warehouse_id),
    }).send(res);
  };

  getAssetDetail = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "lấy chi tiết tài sản thành công",
      data: await AssetService.getAssetDetail(req.params.assetCode),
    }).send(res);
  };

  generateCode = async (req: Request, res: Response, next: NextFunction) => {
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.ASSET,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });
    return new OK({
      message: "lấy chi tiết tài sản thành công",
      data: await AssetService.generateCode(req.body),
    }).send(res);
  };

  getAllAssetsAllocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "lấy danh sách tài sản thành công",
      data: await WarehouseService.getAssetsAllcationOwn(req.user.id),
    }).send(res);
  };
}
export default new AssetController();
