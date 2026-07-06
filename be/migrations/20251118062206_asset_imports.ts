import type { Knex } from "knex";
import {ASSET_IMPORTS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration tao bang asset_imports.
// Bang nay luu thong tin rieng cua phieu nhap kho; cac dong hang nam o asset_transaction_items.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ASSET_IMPORTS_TABLE_NAME, (table) => {
    table.increments("id").primary();

    // Tro ve asset_transactions.id de biet chi tiet nhap thuoc phieu nao.
    table
      .integer("transaction_id");

    table.timestamp("received_date").notNullable(); // ngày nhận
    table.string("sender_location").nullable();     // nơi gửi
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
  // Rollback xoa bang chi tiet nhap kho.
  await knex.schema.dropTableIfExists(ASSET_IMPORTS_TABLE_NAME);
}
