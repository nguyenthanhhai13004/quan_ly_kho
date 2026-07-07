import { Knex } from "knex";
import { WAREHOUSE_ASSET_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";
import AssetStatusEnum from "../src/v1/cores/enums/assets-status.enum";
import { generateBatchCode } from "../src/v1/utils/generate-batch-code";
import { ASSETS_DEFAULT } from "./005_assets";

const ASSET_CODE_BY_ID = new Map(
  ASSETS_DEFAULT.map((asset) => [asset.id, asset.code]),
);
const ASSET_COST_BY_ID = new Map(
  ASSETS_DEFAULT.map((asset) => [asset.id, asset.cost]),
);

interface SeedWarehouseAsset {
  warehouse_id: number;
  asset_id: number;
  quantity: number;
  cost?: number;
  seed_date?: Date;
  status?: AssetStatusEnum;
}

const MILITARY_SCIENCE_ACADEMY_WAREHOUSE_ID = 7;
const MONTHS_FROM_JANUARY_TO_JULY = [0, 1, 2, 3, 4, 5, 6];

function generateSeedDateFromJanuaryToNow(index: number, total: number): Date {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1, 8, 0, 0, 0);
  const ratio = total <= 1 ? 1 : index / (total - 1);

  return new Date(
    startOfYear.getTime() + (now.getTime() - startOfYear.getTime()) * ratio,
  );
}

function createMilitaryScienceAcademyWarehouseAssets(): SeedWarehouseAsset[] {
  const now = new Date();
  const year = now.getFullYear();
  const assetIds = ASSETS_DEFAULT.map((asset) => asset.id);

  return MONTHS_FROM_JANUARY_TO_JULY.flatMap((monthIndex) =>
    assetIds.flatMap((asset_id, assetIndex) =>
      [0, 1].map((batchIndex) => {
        const day =
          monthIndex === 6
            ? 1 + ((assetIndex + batchIndex) % now.getDate())
            : 5 + ((assetIndex * 3 + monthIndex + batchIndex * 2) % 20);
        const baseCost = ASSET_COST_BY_ID.get(asset_id) ?? 100000;

        return {
          warehouse_id: MILITARY_SCIENCE_ACADEMY_WAREHOUSE_ID,
          asset_id,
          quantity:
            12 +
            (((assetIndex + 1) * (monthIndex + 2) + batchIndex * 11) % 95),
          cost: Math.round(baseCost * (0.95 + monthIndex * 0.01)),
          seed_date: new Date(year, monthIndex, day, 8 + batchIndex, 0, 0, 0),
        };
      }),
    ),
  );
}

const WAREHOUSE_ASSETS_DEFAULT: SeedWarehouseAsset[] = [
  { warehouse_id: 1, asset_id: 1, quantity: 30 },
  { warehouse_id: 1, asset_id: 3, quantity: 10 },
  { warehouse_id: 1, asset_id: 5, quantity: 25 },
  { warehouse_id: 1, asset_id: 7, quantity: 100 },
  { warehouse_id: 2, asset_id: 2, quantity: 40 },
  { warehouse_id: 2, asset_id: 6, quantity: 20 },
  { warehouse_id: 2, asset_id: 9, quantity: 500 },
  { warehouse_id: 2, asset_id: 10, quantity: 200 },
  { warehouse_id: 3, asset_id: 11, quantity: 25 },
  { warehouse_id: 3, asset_id: 13, quantity: 5 },
  { warehouse_id: 3, asset_id: 15, quantity: 15 },
  { warehouse_id: 3, asset_id: 17, quantity: 80 },
  { warehouse_id: 4, asset_id: 4, quantity: 12 },
  { warehouse_id: 4, asset_id: 8, quantity: 150 },
  { warehouse_id: 4, asset_id: 19, quantity: 300 },
  { warehouse_id: 4, asset_id: 20, quantity: 2000 },
  { warehouse_id: 5, asset_id: 12, quantity: 60 },
  { warehouse_id: 5, asset_id: 16, quantity: 8 },
  { warehouse_id: 5, asset_id: 18, quantity: 70 },
  { warehouse_id: 5, asset_id: 2, quantity: 15 },
  { warehouse_id: 6, asset_id: 1, quantity: 20 },
  { warehouse_id: 6, asset_id: 5, quantity: 10 },
  { warehouse_id: 6, asset_id: 6, quantity: 8 },
  { warehouse_id: 6, asset_id: 15, quantity: 12 },
  ...createMilitaryScienceAcademyWarehouseAssets(),
  { warehouse_id: 8, asset_id: 3, quantity: 7 },
  { warehouse_id: 8, asset_id: 11, quantity: 40 },
  { warehouse_id: 8, asset_id: 17, quantity: 60 },
  { warehouse_id: 8, asset_id: 18, quantity: 50 },
  { warehouse_id: 9, asset_id: 13, quantity: 6 },
  { warehouse_id: 9, asset_id: 14, quantity: 3 },
  { warehouse_id: 9, asset_id: 19, quantity: 500 },
  { warehouse_id: 9, asset_id: 20, quantity: 1000 },
  { warehouse_id: 10, asset_id: 1, quantity: 100 },
  { warehouse_id: 10, asset_id: 2, quantity: 80 },
  { warehouse_id: 10, asset_id: 3, quantity: 20 },
  { warehouse_id: 10, asset_id: 12, quantity: 200 },
].map((item, index, items) => {
  const { seed_date, cost: itemCost, ...warehouseAsset } = item;
  const seedDate =
    seed_date ?? generateSeedDateFromJanuaryToNow(index, items.length);
  const manufacture = new Date(seedDate);
  manufacture.setMonth(manufacture.getMonth() - 2); // sản xuất 2 tháng trước

  let expiration = new Date(seedDate);
  expiration.setFullYear(expiration.getFullYear() + 1); // hết hạn sau 1 năm

  let maintenance = new Date(seedDate);
  maintenance.setMonth(maintenance.getMonth() + 3); // bảo trì sau 3 tháng

  const assetCode = ASSET_CODE_BY_ID.get(warehouseAsset.asset_id);
  if (!assetCode) {
    throw new Error(
      `Asset ${warehouseAsset.asset_id} does not have a seed code`,
    );
  }

  const batch_code = generateBatchCode(assetCode, seedDate);
  const cost = itemCost ?? 100000;
  let status = item.status ?? AssetStatusEnum.GOOD;

  if (warehouseAsset.warehouse_id === MILITARY_SCIENCE_ACADEMY_WAREHOUSE_ID) {
    const now = new Date();
    const variant = (warehouseAsset.asset_id + seedDate.getMonth() + index) % 6;

    if (variant === 0) {
      status = AssetStatusEnum.BROKEN;
      expiration = new Date(now.getFullYear() + 1, now.getMonth(), 15);
      maintenance = new Date(now.getFullYear(), now.getMonth() + 2, 15);
    } else if (variant === 1) {
      status = AssetStatusEnum.MAINTENANCE;
      expiration = new Date(now.getFullYear() + 1, now.getMonth(), 10);
      maintenance = new Date(now);
      maintenance.setDate(now.getDate() - ((index % 20) + 1));
    } else if (variant === 2) {
      status = AssetStatusEnum.EXPIRED;
      expiration = new Date(now);
      expiration.setDate(now.getDate() - ((index % 45) + 1));
      maintenance = new Date(now.getFullYear(), now.getMonth() + 2, 5);
    } else if (variant === 3) {
      status = AssetStatusEnum.GOOD;
      expiration = new Date(now);
      expiration.setDate(now.getDate() + ((index % 9) + 1));
      maintenance = new Date(now.getFullYear(), now.getMonth() + 3, 20);
    }
  }

  return {
    ...warehouseAsset,
    batch_code,
    manufacture_date: manufacture,
    expiration_date: expiration,
    maintenance_due: maintenance,
    status,
    cost,
    created_at: seedDate,
    updated_at: seedDate,
  };
});

export default WAREHOUSE_ASSETS_DEFAULT;


export async function seed(knex: Knex): Promise<void> {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    // Deletes ALL existing entries
    await knex(WAREHOUSE_ASSET_TABLE_NAME).del();

    // Inserts seed entries
    await knex(WAREHOUSE_ASSET_TABLE_NAME).insert(WAREHOUSE_ASSETS_DEFAULT);
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
