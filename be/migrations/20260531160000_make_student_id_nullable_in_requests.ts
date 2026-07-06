import type { Knex } from "knex";
import { ADVISOR_REQUESTS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration cho phep advisor_requests.student_id duoc null.
// Ly do: yeu cau co the ap dung cho ca lop, khong bat buoc gan voi mot sinh vien cu the.
export async function up(knex: Knex): Promise<void> {
  const hasAdvisorRequests = await knex.schema.hasTable(ADVISOR_REQUESTS_TABLE_NAME);
  if (hasAdvisorRequests) {
    // Alter student_id to be nullable
    // Note: Knex 'alter' works well in MySQL to change nullability if we redefine the column.
    await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
      table.integer("student_id").unsigned().nullable().alter();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasAdvisorRequests = await knex.schema.hasTable(ADVISOR_REQUESTS_TABLE_NAME);
  if (hasAdvisorRequests) {
    // Rollback dua student_id ve bat buoc, phu hop voi thiet ke request ban dau.
    await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
      table.integer("student_id").unsigned().notNullable().alter();
    });
  }
}
