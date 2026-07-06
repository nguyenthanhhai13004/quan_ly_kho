import type { Knex } from "knex";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration them avatar_url vao users.
// Cot nay luu duong dan anh dai dien sau khi upload file.
export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(USER_TABLE_NAME, (table) => {
    table.string("avatar_url").nullable().after("phone_number");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback bo cot avatar_url.
  return knex.schema.alterTable(USER_TABLE_NAME, (table) => {
    table.dropColumn("avatar_url");
  });
}
