import {
  ASSET_TABLE_NAME,
  CATEGORY_TABLE_NAME,
  WAREHOUSE_ASSET_TABLE_NAME,
} from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import { Asset } from "../models/asset.model";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { Knex } from "knex";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import ResponseAssetDto from "../dtos/asset/response-asset.dto";
import db from "../databases/init.mysql-v2";
import { getInfoData } from "../utils/get-info-data";
import { WarehouseAsset } from "../models/warehouse-asset.model";
import { InternalServerError } from "../cores/error.response";

class AssetRepository extends BaseRepository<Asset> {
  constructor() {
    super(ASSET_TABLE_NAME);
  }

  async findAllPaginationCustom(
    warehouse_id: number,
    paginationDto: PaginationAssetsDto,
  ): Promise<ResponsePaginationDto<ResponseAssetDto>> {
    const { page, size } = paginationDto;
    const offset = (page - 1) * size;

    const query = db(this.tableName)
      .select(
        `${this.tableName}.*`,
        `${CATEGORY_TABLE_NAME}.name as category_name`,
        `${CATEGORY_TABLE_NAME}.id as category_id`,
        `${CATEGORY_TABLE_NAME}.description as category_description`,
        db.raw(
          `COALESCE(SUM(${WAREHOUSE_ASSET_TABLE_NAME}.quantity), 0) as total_quantity`,
        ),
      )
      .innerJoin(
        CATEGORY_TABLE_NAME,
        `${this.tableName}.category_id`,
        `${CATEGORY_TABLE_NAME}.id`,
      )
      .leftJoin(
        `${WAREHOUSE_ASSET_TABLE_NAME}`,
        `${this.tableName}.id`,
        `${WAREHOUSE_ASSET_TABLE_NAME}.asset_id`,
      )
      .where(`${WAREHOUSE_ASSET_TABLE_NAME}.warehouse_id`, warehouse_id)
      .whereNull(`${this.tableName}.deleted_at`)
      .groupBy(`${this.tableName}.id`, `${CATEGORY_TABLE_NAME}.id`);

    if (paginationDto.category_id != null) {
      query.where(`${this.tableName}.category_id`, paginationDto.category_id);
    }
    if (paginationDto.code) {
      query.whereILike(`${this.tableName}.code`, `%${paginationDto.code}%`);
    }
    if (paginationDto.name) {
      query.whereILike(`${this.tableName}.name`, `%${paginationDto.name}%`);
    }
    if (paginationDto.status != null) {
      query.where(`${this.tableName}.status`, paginationDto.status);
    }

    const totalQuery = query
      .clone()
      .clearSelect()
      .clearOrder()
      .countDistinct<{ count: number }[]>(`${this.tableName}.id as count`);
    const [{ count }] = await totalQuery;

    const rows = await query
      .limit(size)
      .offset(offset)
      .orderBy(`${this.tableName}.id`, "desc");

    const items = rows.map((row) => ({
      ...getInfoData<ResponseAssetDto>({
        fields: [
          "id",
          "code",
          "cost",
          "description",
          "image_url",
          "import_date",
          "maintenance_due",
          "status",
          "name",
        ],
        object: row,
      }),
      category: {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
      },
      quantity: Number(row.total_quantity),
    })) as ResponseAssetDto[];

    return {
      items,
      size,
      page,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }

  async createWithWarehouse(
    dataAsset: Partial<Asset>,
    dataWarehouseAsset: Partial<WarehouseAsset>,
  ): Promise<Asset> {
    return await db.transaction(async (trx) => {
      // Tạo asset
      const [assetId] = await trx(this.tableName)
        .insert(dataAsset)
        .returning("id");

      const newAsset = await trx(this.tableName).where({ id: assetId }).first();

      dataWarehouseAsset.asset_id = assetId;

      await trx(WAREHOUSE_ASSET_TABLE_NAME)
        .insert(dataWarehouseAsset)
        .returning("id");

      return newAsset;
    });
  }

  async findDetailById(id: number | string): Promise<ResponseAssetDto | null> {
    const asset = await db(this.tableName)
      .select(
        `${this.tableName}.*`,
        "categories.name as category_name",
        "categories.id as category_id",
        "categories.description as category_description",
        "categories.color as category_color",
      )
      .innerJoin("categories", `${this.tableName}.category_id`, "categories.id")
      .where(`${this.tableName}.id`, id)
      .whereNull(`${this.tableName}.deleted_at`)
      .first();

    if (!asset) return null;

    return {
      ...getInfoData<ResponseAssetDto>({
        fields: [
          "id",
          "code",
          "cost",
          "description",
          "image_url",
          "import_date",
          "maintenance_due",
          "status",
          "name",
        ],
        object: asset,
      }),
      category: {
        id: asset.category_id,
        name: asset.category_name,
        description: asset.category_description,
        color: asset.category_color,
      },
    } as ResponseAssetDto;
  }
}
export default new AssetRepository();
