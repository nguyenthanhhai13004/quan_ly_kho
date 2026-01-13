import type { Knex } from "knex";
import { ASSET_EXPORTS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ASSET_EXPORTS_TABLE_NAME, (table) => {
    table.increments("id").primary();

    table.integer("transaction_id");

    table.timestamp("export_date").notNullable(); // ngày xuất kho

    table.string("receiver_name").notNullable(); // người nhận
    table.string("receiver_phone").nullable(); // SĐT
    table.string("receiver_address").nullable(); // Địa chỉ

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
  await knex.schema.dropTableIfExists(ASSET_EXPORTS_TABLE_NAME);
}
