import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import CategoryService from "../services/category.service";
import AssetService from "../services/asset.service";
import { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import { HEADERS } from "../cores/constants/headers.constants";

class AssetController {
  getAllAssets = async (req: Request, res: Response, next: NextFunction) => {
    const query = {
      page: req.query.page || 1,
      size: req.query.size || 20,
      status: req.query.status,
      category_id: req.query.category_id,
      code: req.query.code,
      name: req.query.name,
    } as PaginationAssetsDto;
    const warehouse_id = req.headers[HEADERS.X_WAREHOUSE_ID] as string;
    return new OK({
      message: "danh sách tài sản",
      data: await AssetService.getAllAssets(Number(warehouse_id),query),
    }).send(res);
  };

  createAsset = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "tạo tài sản thành công",
      data: await AssetService.addNewAsset(req.user.id, req.body),
    }).send(res);
  };

  updateAsset = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "cập nhật tài sản thành công",
      data: await AssetService.updateAsset(
        req.user.id,
        Number(req.params.id),
        req.body,
      ),
    }).send(res);
  };

  deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "xóa tài sản thành công",
      data: await AssetService.deleteAsset(),
    }).send(res);
  };

  getAssetDetail = async (req: Request, res: Response, next: NextFunction) => {
    return new OK({
      message: "lấy chi tiết tài sản thành công",
      data: await AssetService.getAssetDetail(Number(req.params.id)),
    }).send(res);
  };
}
export default new AssetController();
