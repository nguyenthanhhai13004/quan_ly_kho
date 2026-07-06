import type { Knex } from "knex";
import {
  USER_TABLE_NAME,
  ADVISOR_REQUESTS_TABLE_NAME,
} from "../src/v1/cores/constants/table-name.constant";

// Migration them luong commander/advisor gui yeu cau cap phat, thu hoi hoac y kien khac.
// advisor_requests la bang de can bo kho duyet/tiep nhan cac yeu cau tu chi huy/co van.
export async function up(knex: Knex): Promise<void> {
  // 1. Add class_id to users table (defensive check, no FK constraint)
  // class_id gan user commander voi lop phu trach; FK duoc bo sung sau.
  const hasClassId = await knex.schema.hasColumn(USER_TABLE_NAME, "class_id");
  if (!hasClassId) {
    await knex.schema.alterTable(USER_TABLE_NAME, (table) => {
      table.integer("class_id").unsigned().nullable();
    });
  }

  // 2. Create advisor_requests table (defensive check, no FK constraints)
  // Moi dong yeu cau ung voi mot tai san trong don yeu cau; cac dong cung note/class co the duoc gom nhom o UI.
  const hasAdvisorRequests = await knex.schema.hasTable(ADVISOR_REQUESTS_TABLE_NAME);
  if (!hasAdvisorRequests) {
    await knex.schema.createTable(ADVISOR_REQUESTS_TABLE_NAME, (table) => {
      table.increments("id").primary().unique();
      table.integer("advisor_id").unsigned().notNullable();
      table.integer("class_id").unsigned().notNullable();
      table.integer("student_id").unsigned().notNullable();
      table.integer("asset_id").unsigned().notNullable();
      table.integer("quantity").unsigned().notNullable().defaultTo(1);
      table.integer("type").notNullable(); // 1: Cấp phát, 2: Thu hồi
      table.integer("status").notNullable().defaultTo(0); // 0: Chờ duyệt, 1: Đã duyệt, 2: Từ chối
      table.text("note").nullable();
      table.text("response_note").nullable();
      table.integer("processed_by_user_id").unsigned().nullable();
      table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
      table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Drop requests table
  // Rollback xoa bang yeu cau truoc, sau do bo class_id khoi users.
  await knex.schema.dropTableIfExists(ADVISOR_REQUESTS_TABLE_NAME);

  // Drop class_id from users table
  const hasClassId = await knex.schema.hasColumn(USER_TABLE_NAME, "class_id");
  if (hasClassId) {
    await knex.schema.alterTable(USER_TABLE_NAME, (table) => {
      table.dropColumn("class_id");
    });
  }
}
