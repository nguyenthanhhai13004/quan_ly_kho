import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../cores/error.response";
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

class AssetService {
  static async getAllAssets(
    warehouse_id: number,
    paginationAssetsDto: PaginationAssetsDto,
  ): Promise<ResponsePaginationDto<ResponseAssetDto>> {
    return await assetRepository.findAllPaginationCustom(
      warehouse_id,
      paginationAssetsDto,
    );
  }

  static async addNewAsset(
    userId: number,
    createAssetDto: CreateAssetDto,
  ): Promise<Asset> {
    const {
      category_id,
      code,
      name,
      quantity,
      description,
      image,
      maintenance_due,
      status,
      cost,
      warehouse_id,
    } = createAssetDto;

    const [warehouseFound, userHasWarehouse, categoryFound, assetFound] =
      await Promise.all([
        warehouseRepository.findOneByCondition({ id: warehouse_id }),
        warehouseUserRepository.findOneByCondition({
          user_id: userId,
          warehouse_id,
        }),
        categoryRepository.findOneByCondition({ id: category_id }),
        assetRepository.findOneByCondition({ code }),
      ]);

    if (!warehouseFound) {
      throw new BadRequestError("Kho không tồn tại");
    }

    if (!userHasWarehouse) {
      throw new BadRequestError("Người dùng không có quyền với kho này");
    }

    if (!categoryFound) {
      throw new BadRequestError("Danh mục không tồn tại");
    }

    if (assetFound) {
      const assetExitInWH = await warehouseAssetRepository.findOneByCondition({
        asset_id: assetFound.id,
        warehouse_id,
      });
      if (assetExitInWH){
        throw new BadRequestError("Mã tài sản đã tồn tại");
      }

      await warehouseAssetRepository.addQuantityAssetToWarehouse({
        asset_id:assetFound.id,
        quantity,
        warehouse_id
      })
      return assetFound;
    }

    const dataAsset = {
      code,
      category_id,
      name,
      description,
      image_url: image,
      cost,
      status,
    };
    const dataWarehouseAsset = {
      warehouse_id,
      quantity,
    };

    const assetStore = await assetRepository.createWithWarehouse(
      dataAsset,
      dataWarehouseAsset,
    );

    if (!assetStore) {
      throw new InternalServerError();
    }

    return assetStore;
  }

  static async updateAsset(
    userId: number,
    assetId: number,
    updateAssetDto: UpdateAssetDto,
  ): Promise<Asset> {
    const {
      category_id,
      name,
      description,
      image,
      maintenance_due,
      status,
      cost,
      warehouse_id,
    } = updateAssetDto;
    const [warehouseFound, userHasWarehouse, categoryFound, assetFound] =
      await Promise.all([
        warehouseRepository.findOneByCondition({ id: warehouse_id }),
        warehouseUserRepository.findOneByCondition({
          user_id: userId,
          warehouse_id,
        }),
        categoryRepository.findOneByCondition({ id: category_id }),
        assetRepository.findOneByCondition({ id: assetId }),
      ]);
    if (!warehouseFound) {
      throw new BadRequestError("Kho không tồn tại");
    }

    if (!userHasWarehouse) {
      throw new BadRequestError("Người dùng không có quyền với kho này");
    }

    if (!categoryFound) {
      throw new BadRequestError("Danh mục không tồn tại");
    }

    if (!assetFound) {
      throw new BadRequestError("tài sản không tồn tại");
    }

    const updated = await assetRepository.update(assetId, {
      category_id,
      cost,
      description,
      image_url: image,
      maintenance_due,
      status,
      name,
    });

    if (!updated) {
      throw new InternalServerError("có lỗi xảy ra, thử lại sau.");
    }

    return updated;
  }

  static async deleteAsset() {
    throw new BadRequestError(
      "Không thể xóa vì tài sản còn ghi nhận. Kiểm tra lịch cấp phát, xuất kho, bảo trì.",
    );
  }

  static async getAssetDetail(assetId: number): Promise<ResponseAssetDto> {
    const assetFound = await assetRepository.findDetailById(assetId);
    if (!assetFound) {
      throw new NotFoundError("không tìm thấy tài sản");
    }
    return assetFound;
  }
}

export default AssetService;
