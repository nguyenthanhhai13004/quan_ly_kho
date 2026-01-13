import type { Knex } from "knex";
import {
  USER_TABLE_NAME,
  WAREHOUSE_TABLE_NAME,
  WAREHOUSE_USER_TABLE_NAME,
} from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(WAREHOUSE_USER_TABLE_NAME, (table) => {
    table.integer("user_id").unsigned().notNullable();
    table.integer("warehouse_id").unsigned().notNullable();
    // table
    //   .foreign("user_id")
    //   .references("id")
    //   .inTable(USER_TABLE_NAME)
    //   .onDelete("CASCADE");
    // table
    //   .foreign("warehouse_id")
    //   .references("id")
    //   .inTable(WAREHOUSE_TABLE_NAME)
    //   .onDelete("CASCADE");

    // table.primary(["warehouse_id", "user_id"]);

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(WAREHOUSE_USER_TABLE_NAME);
}
