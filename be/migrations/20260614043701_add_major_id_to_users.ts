import type { Knex } from "knex";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(USER_TABLE_NAME, (table) => {
    table.integer("major_id").unsigned().nullable().after("class_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(USER_TABLE_NAME, (table) => {
    table.dropColumn("major_id");
  });
}
