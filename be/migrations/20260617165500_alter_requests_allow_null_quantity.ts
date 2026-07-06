import type { Knex } from "knex";
import { ADVISOR_REQUESTS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration cho phep advisor_requests.quantity duoc null.
// Ly do: yeu cau "khac" chi co noi dung ghi chu, khong nhat thiet co so luong tai san.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("quantity").unsigned().nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback dua quantity ve bat buoc va mac dinh 1.
  await knex.schema.alterTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
    table.integer("quantity").unsigned().notNullable().defaultTo(1).alter();
  });
}
