import type { Knex } from "knex";
import { ADVISOR_REQUESTS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration noi long asset_id va student_id trong advisor_requests.
// Ly do: yeu cau "khac" hoac yeu cau theo lop co the khong gan voi mot tai san/sinh vien cu the.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("asset_id").unsigned().nullable().alter();
    table.integer("student_id").unsigned().nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback dua asset_id va student_id ve bat buoc nhu thiet ke cu.
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("asset_id").unsigned().notNullable().alter();
    table.integer("student_id").unsigned().notNullable().alter();
  });
}
