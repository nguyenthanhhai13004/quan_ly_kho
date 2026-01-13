import { Knex } from "knex";
import { ASSET_TRANSACTIONS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ASSET_TRANSACTIONS_TABLE_NAME, (table) => {
    table.increments("id").primary();

    table.string("code").notNullable();
    table.string("name").notNullable();

    table
      .integer("warehouse_id")

    table.integer("type").notNullable(); // allocation, return, disposal, import, export...

    table.string("note");
    table.string("reason");

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
  await knex.schema.dropTableIfExists(ASSET_TRANSACTIONS_TABLE_NAME);
}
