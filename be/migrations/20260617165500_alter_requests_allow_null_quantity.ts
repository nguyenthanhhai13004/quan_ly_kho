import type { Knex } from "knex";
import { ADVISOR_REQUESTS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("quantity").unsigned().nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("quantity").unsigned().notNullable().defaultTo(1).alter();
  });
}
