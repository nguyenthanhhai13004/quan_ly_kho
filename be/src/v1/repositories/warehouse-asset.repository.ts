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
  ): Promise<boolean> {
    const { asset_id, quantity, warehouse_id } = data;
    return await db.transaction(async (trx) => {
      const existing = await trx(this.tableName)
        .where({ asset_id, warehouse_id })
        .whereNull("deleted_at")
        .first();

      if (existing) {
        const updated = await trx(this.tableName)
          .where({ id: existing.id })
          .update({
            quantity: existing.quantity + quantity,
            updated_at: db.fn.now(),
          });

        return updated > 0;
      } else {
        const [createdId] = await trx(this.tableName).insert({
          asset_id,
          warehouse_id,
          quantity,
        });
        return !!createdId;
      }
    });
  }
}
export default new WarehouseAssetRepository();
