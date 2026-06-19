import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const hasWarehouseId = await knex.schema.hasColumn("advisor_requests", "warehouse_id");
  if (!hasWarehouseId) {
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.integer("warehouse_id").unsigned().nullable();
    });

    // Populate existing requests' warehouse_id based on advisor's current warehouse
    const requests = await knex("advisor_requests").select("id", "advisor_id");
    for (const req of requests) {
      const warehouseUser = await knex("warehouse_user")
        .where("user_id", req.advisor_id)
        .first("warehouse_id");
      if (warehouseUser) {
        await knex("advisor_requests")
          .where("id", req.id)
          .update({ warehouse_id: warehouseUser.warehouse_id });
      }
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasWarehouseId = await knex.schema.hasColumn("advisor_requests", "warehouse_id");
  if (hasWarehouseId) {
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.dropColumn("warehouse_id");
    });
  }
}
