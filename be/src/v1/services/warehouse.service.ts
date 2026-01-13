import { WAREHOUSE_ASSET_TABLE_NAME } from "../cores/constants/table-name.constant";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import AssetStatusEnum from "../cores/enums/assets-status.enum";
import MaintenanceStatusEnum from "../cores/enums/maintenance-status.enum";
import WarehouseTransactionTypeEnum from "../cores/enums/warehouse-transaction-type.enum";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../cores/error.response";
import db from "../databases/init.mysql-v2";
import { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import { ManualImportToWarehouseDto } from "../dtos/warehouse/manual-import-to-warehouse.dto";
import { PaginationAssetsInWHDto } from "../dtos/warehouse/pagination-assets-in-wh";
import { WarehouseAsset } from "../models/warehouse-asset.model";
import { Warehouse } from "../models/warehouse.model";
import addressRepository from "../repositories/address.repository";
import assetRepository from "../repositories/asset.repository";
import warehouseAssetRepository from "../repositories/warehouse-asset.repository";
import warehouseRepository from "../repositories/warehouse.repository";
import { resolveStatus } from "../utils/resolve-status";

export interface ImportWarehouseFromExcelDto {
  asset_code: number;
  asset_name: number;
  category_name: number;
  quantity: number;
  cost: number;
  import_date: Date;
  note: string;
  maintenance_due: Date;
}

export const AssetStatusTextMap: Record<number, string> = {
  [AssetStatusEnum.GOOD]: "Tốt",
  [AssetStatusEnum.MAINTENANCE]: "Cần bảo trì",
  [AssetStatusEnum.BROKEN]: "Lỗi",
  [AssetStatusEnum.EXPIRED]: "Hết hạn",
};

class WarehouseService {
  static generateWarehouseCode(name: string): string {
    const normalize = (str: string) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();

    const initials = normalize(name)
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase())
      .join("")
      .slice(0, 3);

    const now = new Date();
    const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");

    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `WH-${initials}-${datePart}-${randomPart}`;
  }

  static async createWarehouse({
    userId,
    name,
    // province_code,
    // ward_code,
    address_detail,
    latitude,
    longitude,
  }: {
    userId: number;
    name: string;
    // province_code: string;
    // ward_code: string;
    address_detail: string;
    latitude?: number | null;
    longitude?: number | null;
  }) {
    const existingWarehouse = await warehouseRepository.findOneByCondition({
      name,
    });
    if (existingWarehouse) {
      throw new BadRequestError("kho đã tồn tại, vui lòng đặt tên khác");
    }

    // create new address
    const address = await addressRepository.create({
      address_detail,
      latitude,
      longitude,
    });

    if (!address) {
      throw new InternalServerError("Tạo thất bại");
    }

    const newWarehouse = await warehouseRepository.create({
      code: this.generateWarehouseCode(name),
      name,
      address_id: address.id,
      created_by_user_id: userId,
      modified_by_user_id: userId,
    });
    if (!newWarehouse) {
      throw new InternalServerError("Tạo kho thất bại");
    }
    return newWarehouse;
  }

  static async getAllWarehouseOwn(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<ResponsePaginationDto<Warehouse>> {
    return await warehouseRepository.findAllOwn(userId, paginationDto);
  }
  static async getAllWarehouseAny(
    paginationDto: PaginationDto & {
      keyword?: string;
    },
  ) {
    return await warehouseRepository.findAllWithUsers(paginationDto);
  }

  static async getDetailBatch(batchCode: string) {
    const batchFound = await warehouseAssetRepository.findOneByCondition({
      batch_code: batchCode,
    });
    if (!batchFound) {
      throw new NotFoundError("mã không tồn tại");
    }
    return batchFound;
  }

  static async getAllBatchesByAssetCodeInWarehouseOwn(
    assetCode: string,
    warehouseId: number,
  ) {
    const assetFound = await assetRepository.findOneByCondition({
      code: assetCode,
    });

    if (!assetFound || !warehouseId) {
      throw new NotFoundError("mã không tồn tại");
    }
    const batches = await warehouseAssetRepository.findByCondition({
      asset_id: assetFound.id,
      warehouse_id: warehouseId,
    });
    const batchesWithStatus = batches.map((batch) => {
      const statusEnum = resolveStatus(batch);
      return {
        ...batch,
        status: statusEnum,
      };
    });

    return batchesWithStatus;
  }

  static async getAllBatchesNeedMaintenanceInWHOwn(warehouseId: number) {
    const now = new Date();

    const batches = await db("warehouse_asset as wa")
      .join("assets as a", "wa.asset_id", "a.id")
      .select(
        "wa.*",
        "a.name as asset_name",
        "a.code as asset_code",
        "a.category_id",
      )
      .where("wa.warehouse_id", warehouseId)
      .andWhere((qb) => {
        qb.where("wa.status", AssetStatusEnum.MAINTENANCE).orWhere((q2) => {
          q2.whereNotNull("wa.maintenance_due").andWhere(
            "wa.maintenance_due",
            "<=",
            now,
          );
        });
      });

    return batches;
  }

  static async getAllAssetsInWarehouseOwn(
    { page, size, category_id, code, name }: PaginationAssetsDto,
    warehouse_id: number,
  ) {
    const offset = (page - 1) * size;

    let assetQuery = db("assets as a")
      .select(
        "a.id",
        "a.code as asset_code",
        "a.name as asset_name",
        "a.image_url",
        "c.name as category_name",
      )
      .innerJoin("warehouse_asset as wa", "wa.asset_id", "a.id")
      .innerJoin("categories as c", "c.id", "a.category_id")
      .where("wa.warehouse_id", warehouse_id);

    if (code && code.trim() !== "") {
      assetQuery = assetQuery.where("a.code", "like", `%${code}%`);
    }

    if (name && name.trim() !== "") {
      assetQuery = assetQuery.where("a.name", "like", `%${name}%`);
    }

    if (category_id) {
      assetQuery = assetQuery.where("a.category_id", category_id);
    }

    assetQuery = assetQuery.groupBy("a.id").limit(size).offset(offset);

    const assets = await assetQuery;

    if (assets.length === 0) {
      return {
        items: [],
        page,
        size,
        total: 0,
        totalPages: 0,
      };
    }

    const assetIds = assets.map((a) => a.id);

    const statusRows = await db<WarehouseAsset>("warehouse_asset")
      .select(
        "asset_id",
        "status",
        "expiration_date",
        "maintenance_due",
        db.raw("SUM(quantity) as quantity"),
      )
      .where("warehouse_id", warehouse_id)
      .whereIn("asset_id", assetIds)
      .groupBy("asset_id", "status", "expiration_date", "maintenance_due");

    const statusMap = new Map<number, any[]>();

    for (const row of statusRows) {
      const finalStatus = resolveStatus(row);
      const qty = Number(row.quantity);

      if (!statusMap.has(row.asset_id)) {
        statusMap.set(row.asset_id, []);
      }

      const list = statusMap.get(row.asset_id)!;

      const existed = list.find((x) => x.status === finalStatus);

      if (existed) {
        existed.quantity += qty;
      } else {
        list.push({
          status: finalStatus,
          quantity: qty,
        });
      }
    }

    const items = assets.map((a) => ({
      id: a.id,
      asset_code: a.asset_code,
      asset_name: a.asset_name,
      image_url: a.image_url,
      category: {
        name: a.category_name,
      },
      status: statusMap.get(a.id) ?? [],
    }));

    let totalQuery = db("assets as a")
      .innerJoin("warehouse_asset as wa", "wa.asset_id", "a.id")
      .where("wa.warehouse_id", warehouse_id);

    if (code && code.trim() !== "") {
      totalQuery = totalQuery.where("a.code", "like", `%${code}%`);
    }

    if (name && name.trim() !== "") {
      totalQuery = totalQuery.where("a.name", "like", `%${name}%`);
    }

    if (category_id) {
      totalQuery = totalQuery.where("a.category_id", category_id);
    }

    const total = await totalQuery
      .countDistinct("a.id as count")
      .first()
      .then((res) => Number(res?.count || 0));

    return {
      items,
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    };
  }

  static async getStatsAssetStatus(warehouse_id: number) {
    const rows = await db("warehouse_asset").where(
      "warehouse_id",
      warehouse_id,
    );

    const statsMap: Record<number, number> = {};

    for (const row of rows) {
      const status = resolveStatus(row);
      statsMap[status] = (statsMap[status] || 0) + Number(row.quantity || 0);
    }

    return Object.entries(statsMap).map(([status, total]) => ({
      status: AssetStatusTextMap[Number(status)],
      count: total,
    }));
  }

  static async getStatsAssetInWH(warehouse_id: number) {
    const today = new Date();
    const totalAssetsInWarehouse = Number(
      (
        await db("warehouse_asset")
          .where("warehouse_id", warehouse_id)
          .sum({ total: "quantity" })
          .first()
      )?.total || 0,
    );

    const totalAllocated = Number(
      (
        await db("asset_lifecycle as al")
          .join(
            "asset_transaction_items as ati",
            "al.transaction_id",
            "ati.transaction_id",
          )
          .join("asset_transactions as at", "al.transaction_id", "at.id")
          .where("at.warehouse_id", warehouse_id)
          .whereNull("al.return_date")
          .whereNull("al.return_deadline")
          .sum({ total: "ati.quantity" })
          .first()
      )?.total || 0,
    );

    const totalNeedMaintenance = Number(
      (
        await db("warehouse_asset")
          .where("warehouse_id", warehouse_id)
          .whereNotNull("maintenance_due")
          .whereNotNull("status")
          .whereNotIn("status", [
            AssetStatusEnum.BROKEN,
            AssetStatusEnum.EXPIRED,
          ])
          .where("maintenance_due", "<=", today)
          .sum({ total: "quantity" })
          .first()
      )?.total || 0,
    );

    return {
      total_assets_in_warehouse: totalAssetsInWarehouse,
      total_allocated: totalAllocated,
      total_need_maintenance: totalNeedMaintenance,
    };
  }

  static async getAssetsAllcationOwn(userId: number) {
    const rows = await db("asset_lifecycle as al")
      .select(
        "al.id as lifecycle_id",
        "al.receiver_id",
        "al.transaction_id",

        "ati.quantity",

        "wa.id as warehouse_asset_id",
        "wa.batch_code",
        "wa.expiration_date",
        "wa.maintenance_due",

        "a.code as asset_code",
        "a.name as asset_name",
        "a.description as asset_description",
        "a.image_url as asset_image_url",

        "c.id as category_id",
        "c.name as category_name",
        "c.code as category_code",
        "w.name as warehouse_name",
      )
      .innerJoin(
        "asset_transaction_items as ati",
        "al.transaction_id",
        "ati.transaction_id",
      )
      .innerJoin("warehouse_asset as wa", "ati.warehouse_asset_id", "wa.id")
      .innerJoin("assets as a", "wa.asset_id", "a.id")
      .innerJoin("categories as c", "a.category_id", "c.id")
      .innerJoin("asset_transactions as at", "al.transaction_id", "at.id")
      .innerJoin("warehouses as w", "at.warehouse_id", "w.id")
      .where("al.receiver_id", userId);

    // ---- GOM NHÓM DỮ LIỆU ----
    const grouped = Object.values(
      rows.reduce((acc: any, row: any) => {
        if (!acc[row.asset_code]) {
          acc[row.asset_code] = {
            asset_code: row.asset_code,
            asset_name: row.asset_name,
            asset_description: row.asset_description,
            asset_image_url: row.asset_image_url,
            warehouse_name: row.warehouse_name,
            category: {
              id: row.category_id,
              code: row.category_code,
              name: row.category_name,
            },
            batches: [],
          };
        }

        acc[row.asset_code].batches.push({
          batch_code: row.batch_code,
          quantity: row.quantity,
          expiration_date: row.expiration_date,
          maintenance_due: row.maintenance_due,
          warehouse_asset_id: row.warehouse_asset_id,
        });

        return acc;
      }, {}),
    );

    return grouped;
  }
}

export default WarehouseService;
