import type { Knex } from "knex";
import { ASSET_MAINTENANCES_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration tao bang asset_maintenances.
// Bang nay luu thong tin rieng cua phieu bao tri: ngay bao tri va trang thai xu ly.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ASSET_MAINTENANCES_TABLE_NAME, (table) => {
    table.increments("id").primary();

    // Tro ve asset_transactions.id de biet bao tri thuoc phieu nao.
    table.integer("transaction_id");

    table.date("maintenance_date").notNullable(); 

    table.integer("status").notNullable(); // 1 done, 2 pedding

    // audit fields
    table.integer("created_by_user_id").unsigned();
    table.integer("modified_by_user_id").unsigned();
    table.integer("deleted_by_user_id").unsigned();

    // timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback xoa bang chi tiet bao tri.
  await knex.schema.dropTableIfExists(ASSET_MAINTENANCES_TABLE_NAME);
}
