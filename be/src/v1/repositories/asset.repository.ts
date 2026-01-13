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

  async findExistedCodes(assetCodes: string[]): Promise<string[]> {
    if (!assetCodes.length) return [];
    return db(this.tableName).whereIn("code", assetCodes).pluck("code");
  }

  async findAllPaginationCustom(
    paginationDto: PaginationAssetsDto,
  ): Promise<ResponsePaginationDto<ResponseAssetDto>> {
    const { page, size, category_id, code, name } = paginationDto;
    const offset = (page - 1) * size;

    const query = db(this.tableName)
      .select(
        `${this.tableName}.*`,
        `${CATEGORY_TABLE_NAME}.name as category_name`,
        `${CATEGORY_TABLE_NAME}.id as category_id`,
        `${CATEGORY_TABLE_NAME}.description as category_description`,
      )
      .innerJoin(
        CATEGORY_TABLE_NAME,
        `${this.tableName}.category_id`,
        `${CATEGORY_TABLE_NAME}.id`,
      )
      .whereNull(`${this.tableName}.deleted_at`);

    if (category_id) query.where(`${this.tableName}.category_id`, category_id);
    if (code) query.whereILike(`${this.tableName}.code`, `%${code}%`);
    if (name) query.whereILike(`${this.tableName}.name`, `%${name}%`);
    const totalQuery = db(this.tableName).whereNull(
      `${this.tableName}.deleted_at`,
    );


    if (category_id)
      totalQuery.where(`${this.tableName}.category_id`, category_id);
    if (code) totalQuery.whereILike(`${this.tableName}.code`, `%${code}%`);
    if (name) totalQuery.whereILike(`${this.tableName}.name`, `%${name}%`);

    const [{ count } = { count: 0 }] = await totalQuery.count({ count: "*" });

    const rows = await query
      .limit(size)
      .offset(offset)
      .orderBy(`${this.tableName}.id`, "desc");

    const items = rows.map((row) => ({
      ...getInfoData<ResponseAssetDto>({
        fields: ["id", "code", "description", "image_url", "name"],
        object: row,
      }),
      category: {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
      },
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
        fields: ["id", "code", "description", "image_url", "name"],
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

  async findDetailByCode(
    code: string | string,
  ): Promise<ResponseAssetDto | null> {
    const asset = await db(this.tableName)
      .select(
        `${this.tableName}.*`,
        "categories.name as category_name",
        "categories.id as category_id",
        "categories.description as category_description",
        "categories.color as category_color",
      )
      .innerJoin("categories", `${this.tableName}.category_id`, "categories.id")
      .where(`${this.tableName}.code`, code)
      .whereNull(`${this.tableName}.deleted_at`)
      .first();

    if (!asset) return null;

    return {
      ...getInfoData<ResponseAssetDto>({
        fields: ["id", "code", "description", "image_url", "name"],
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

  async getAssetIdsByCodes(assetCodes: string[]): Promise<Map<string, number>> {
    const rows = await db(this.tableName)
      .select("id", "code")
      .whereIn("code", assetCodes)
      .whereNull("deleted_at");

    const resultMap = new Map<string, number>();
    rows.forEach((row) => {
      resultMap.set(row.code, row.id);
    });

    return resultMap;
  }
}
export default new AssetRepository();
