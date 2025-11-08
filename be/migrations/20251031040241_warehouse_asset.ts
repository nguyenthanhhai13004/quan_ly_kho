import type { Knex } from "knex";
import { ASSET_TABLE_NAME, WAREHOUSE_ASSET_TABLE_NAME, WAREHOUSE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(WAREHOUSE_ASSET_TABLE_NAME, (table) => {
    table.integer("asset_id").unsigned().notNullable();
    table.integer("warehouse_id").unsigned().notNullable();
    table.integer("quantity").defaultTo(0);
    // table
    //   .foreign("asset_id")
    //   .references("id")
    //   .inTable(ASSET_TABLE_NAME)
    //   .onDelete("CASCADE");
    // table
    //   .foreign("warehouse_id")
    //   .references("id")
    //   .inTable(WAREHOUSE_TABLE_NAME)
    //   .onDelete("CASCADE");

    // table.primary(["warehouse_id", "asset_id"]);
    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(WAREHOUSE_ASSET_TABLE_NAME);
}