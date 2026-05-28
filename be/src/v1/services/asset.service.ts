import { Request } from "express";
import { ROOT_UPLOADS } from "../cores/constants/app.constant";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../cores/error.response";
import db from "../databases/init.mysql-v2";
import { CreateAssetDto } from "../dtos/asset/create-asset.dto";
import { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import ResponseAssetDto from "../dtos/asset/response-asset.dto";
import { UpdateAssetDto } from "../dtos/asset/update-asset.dto";
import { Asset } from "../models/asset.model";
import assetRepository from "../repositories/asset.repository";
import categoryRepository from "../repositories/category.repository";
import warehouseAssetRepository from "../repositories/warehouse-asset.repository";
import warehouseUserRepository from "../repositories/warehouse-user.repository";
import warehouseRepository from "../repositories/warehouse.repository";
import KQNLogService from "./log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";
import { getDiffChangesArray } from "../utils/get-diff-changes";

class AssetService {
  static async getAllAssets(
    paginationAssetsDto: PaginationAssetsDto,
  ): Promise<ResponsePaginationDto<ResponseAssetDto>> {
    return await assetRepository.findAllPaginationCustom(paginationAssetsDto);
  }

  static async addNewAsset(
    userId: number,
    createAssetDto: CreateAssetDto,
  ): Promise<ResponseAssetDto> {
    const { category_id, code, name, description, file } = createAssetDto;

    const [categoryFound, assetFound] = await Promise.all([
      categoryRepository.findOneByCondition({ id: category_id }),
      assetRepository.findOneByCondition({ code }),
    ]);

    if (!categoryFound) {
      throw new BadRequestError("Danh mục không tồn tại");
    }

    if (assetFound) {
      throw new BadRequestError("Mã tài sản đã tồn tại");
    }

    const dataAsset = {
      code,
      category_id,
      name,
      description,
      image_url: file ? `/${ROOT_UPLOADS}/${file.filename}` : "",
    };

    const assetStore = await assetRepository.create({
      ...dataAsset,
      created_by_user_id: userId,
    });

    if (!assetStore) {
      throw new InternalServerError();
    }

    return {
      ...assetStore,
      category: categoryFound,
    };
  }

  static async updateAsset(
    userId: number,
    assetId: number,
    warehouseId: number,
    updateAssetDto: UpdateAssetDto,
    req: Request,
  ): Promise<ResponseAssetDto> {
    const { category_id, name, description, file } = updateAssetDto;

    const [categoryFound, assetFound] = await Promise.all([
      categoryRepository.findOneByCondition({ id: category_id }),
      assetRepository.findOneByCondition({ id: assetId }),
    ]);
    if (!categoryFound) throw new BadRequestError("Danh mục không tồn tại");
    if (!assetFound) throw new BadRequestError("Tài sản không tồn tại");

    const updated = await assetRepository.update(assetId, {
      category_id,
      description,
      image_url: file
        ? `/${ROOT_UPLOADS}/${file.filename}`
        : assetFound.image_url,
      name,
    });


    if (!updated) throw new InternalServerError("Có lỗi xảy ra, thử lại sau.");

    const edit_changes = getDiffChangesArray(
      {
        category_id: assetFound.category_id,
        name: assetFound.name,
        description: assetFound.description,
        image_url: assetFound.image_url,
      },
      {
        category_id,
        name,
        description,
        image_url: file
          ? `/${ROOT_UPLOADS}/${file.filename}`
          : assetFound.image_url,
      },
    );

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: LogController.ASSET,
      username: req.user.username,
      data: req.body,
      ip,
      url,
      edit_changes,
    });

    return {
      ...updated,
      category: categoryFound,
    };
  }

  static async deleteAsset(assetId: number, warehouseId: number) {
    // throw new BadRequestError(
    //   "Không thể xóa vì tài sản còn ghi nhận. Kiểm tra lịch cấp phát, xuất kho, bảo trì.",
    // );
    // const hasAsset = await db("warehouse_asset")
    //   .where({
    //     asset_id: assetId,
    //     warehouse_id: warehouseId,
    //   })
    //   .first();

    // if (!hasAsset) {
    //   throw new BadRequestError(
    //     "Không thể xoá tài sản không thuộc quyền kho của bạn.",
    //   );
    // }

    const inTransaction =
      await warehouseAssetRepository.isAssetInAnyTransaction(assetId);

    if (inTransaction) {
      throw new BadRequestError(
        "Không thể xóa vì tài sản đang ghi nhận trong giao dịch (cấp phát, xuất kho hoặc bảo trì).",
      );
    }

    await assetRepository.softDelete(assetId);
    return 1;
  }

  static async getAssetDetail(assetCode: string): Promise<ResponseAssetDto> {
    const assetFound = await assetRepository.findDetailByCode(assetCode);
    if (!assetFound) {
      throw new NotFoundError("không tìm thấy tài sản");
    }
    return assetFound;
  }

  static async generateCode({
    category_id,
  }: {
    category_id: number;
  }): Promise<string> {
    const category = await categoryRepository.findById(category_id);
    if (!category) {
      throw new NotFoundError("Category không tồn tại");
    }

    const prefix = category.code;
    const latestAsset = await db<Asset>("assets")
      .where("code", "like", `${prefix}-%`)
      .orderBy("code", "desc")
      .first();
    let nextNumber = 1;
    if (latestAsset && latestAsset.code) {
      const match = latestAsset.code.match(/-(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }
    const codeNumber = String(nextNumber).padStart(4, "0");
    return `${prefix}-${codeNumber}`;
  }
}

export default AssetService;
