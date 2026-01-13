import { Knex } from "knex";
import { WAREHOUSE_ASSET_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";
import AssetStatusEnum from "../src/v1/cores/enums/assets-status.enum";
import { generateBatchCode } from "../src/v1/utils/generate-batch-code";

const WAREHOUSE_ASSETS_DEFAULT = [
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
  { warehouse_id: 7, asset_id: 7, quantity: 200 },
  { warehouse_id: 7, asset_id: 8, quantity: 150 },
  { warehouse_id: 7, asset_id: 9, quantity: 400 },
  { warehouse_id: 7, asset_id: 10, quantity: 250 },
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
].map((item, index) => {
  const now = new Date();
  const manufacture = new Date(now);
  manufacture.setMonth(manufacture.getMonth() - 2); // sản xuất 2 tháng trước

  const expiration = new Date(now);
  expiration.setFullYear(expiration.getFullYear() + 1); // hết hạn sau 1 năm

  const maintenance = new Date(now);
  maintenance.setMonth(maintenance.getMonth() + 3); // bảo trì sau 3 tháng

  const batch_code = generateBatchCode("TEST")
  const cost = 100000;
  return {
    ...item,
    batch_code,
    manufacture_date: manufacture,
    expiration_date: expiration,
    maintenance_due: maintenance,
    status: AssetStatusEnum.GOOD,
    cost
  };
});

export default WAREHOUSE_ASSETS_DEFAULT;


export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(WAREHOUSE_ASSET_TABLE_NAME).del();

    // Inserts seed entries
    await knex(WAREHOUSE_ASSET_TABLE_NAME).insert(WAREHOUSE_ASSETS_DEFAULT);
};
