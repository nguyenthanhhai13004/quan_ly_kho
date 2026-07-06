import type { Knex } from "knex";

// Migration them warehouse_id vao advisor_requests.
// Cot nay gan yeu cau voi kho du kien xu ly, giup can bo kho loc va duyet dung pham vi kho.
export async function up(knex: Knex): Promise<void> {
  const hasWarehouseId = await knex.schema.hasColumn("advisor_requests", "warehouse_id");
  if (!hasWarehouseId) {
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.integer("warehouse_id").unsigned().nullable();
    });

    // Gan du lieu cu: lay kho dau tien ma advisor dang duoc phan cong trong warehouse_user.
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
    // Rollback bo cot warehouse_id khoi yeu cau.
    await knex.schema.alterTable("advisor_requests", (table) => {
      table.dropColumn("warehouse_id");
    });
  }
}
