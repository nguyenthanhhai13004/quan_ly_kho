import { WAREHOUSE_ASSET_TABLE_NAME } from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import { WarehouseAsset } from "../models/warehouse-asset.model";
import db from "../databases/init.mysql-v2";

class WarehouseAssetRepository extends BaseRepository<WarehouseAsset> {
  constructor() {
    super(WAREHOUSE_ASSET_TABLE_NAME);
  }

  async addQuantityAssetToWarehouse(
    data: Partial<WarehouseAsset>,
  ): Promise<number> {
    const { asset_id, quantity, warehouse_id } = data;
    return await db.transaction(async (trx) => {
      const existing = await trx(this.tableName)
        .where({ asset_id, warehouse_id })
        .whereNull("deleted_at")
        .first();

      if (existing) {
        const newQuantity = existing.quantity + quantity;

        await trx(this.tableName).where({ id: existing.id }).update({
          quantity: newQuantity,
          updated_at: db.fn.now(),
        });

        return newQuantity;
      } else {
        const [createdId] = await trx(this.tableName).insert({
          asset_id,
          warehouse_id,
          quantity,
        });
        return quantity;
      }
    });
  }
  async findExistedBatchCodes(batchCodes: string[]): Promise<string[]> {
    const rows = await db(this.tableName)
      .select("batch_code")
      .whereIn("batch_code", batchCodes)
      .whereNull("deleted_at");
    return rows.map((row) => row.batch_code);
  }

  async findExistedBatchCodesInWH(
    batchCodes: string[],
    warehouse_id: number,
  ): Promise<string[]> {
    const rows = await db(this.tableName)
      .select("batch_code")
      .where("warehouse_id", warehouse_id)
      .whereIn("batch_code", batchCodes)
      .whereNull("deleted_at");
    return rows.map((row) => row.batch_code);
  }

  async isAssetInAnyTransaction(assetId: number): Promise<boolean> {
    const result = await db("asset_transaction_items as ati")
      .join("warehouse_asset as wa", "ati.warehouse_asset_id", "wa.id")
      .where("wa.asset_id", assetId)
      .whereNull("ati.deleted_at")
      .first("ati.id");

    return !!result;
  }
}
export default new WarehouseAssetRepository();
