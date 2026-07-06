import type { Knex } from "knex";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration them major_id vao users.
// Cot nay dung cho commander/co van de biet user phu trach he/nganh nao.
export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(USER_TABLE_NAME, (table) => {
    table.integer("major_id").unsigned().nullable().after("class_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback bo cot major_id.
  return knex.schema.alterTable(USER_TABLE_NAME, (table) => {
    table.dropColumn("major_id");
  });
}
