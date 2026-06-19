import type { Knex } from "knex";
import { ADVISOR_REQUESTS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("asset_id").unsigned().nullable().alter();
    table.integer("student_id").unsigned().nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("asset_id").unsigned().notNullable().alter();
    table.integer("student_id").unsigned().notNullable().alter();
  });
}
