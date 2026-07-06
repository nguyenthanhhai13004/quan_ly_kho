import type { Knex } from "knex";

// Migration tong hop khoa ngoai cho schema sau khi cac bang chinh da on dinh.
// Cac migration truoc chu yeu tao cot; file nay gan FK that va quy dinh CASCADE / SET NULL / RESTRICT.
export async function up(knex: Knex): Promise<void> {
  // Chuan hoa kieu unsigned/nullable truoc khi gan FK, vi MySQL can cot con khop kieu voi cot cha.
  await knex.schema.alterTable("users", (table) => {
    table.integer("role_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("assets", (table) => {
    table.integer("category_id").unsigned().notNullable().alter();
  });

  await knex.schema.alterTable("warehouses", (table) => {
    table.bigInteger("address_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("asset_transactions", (table) => {
    table.integer("warehouse_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("asset_imports", (table) => {
    table.integer("transaction_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("asset_exports", (table) => {
    table.integer("transaction_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("asset_transaction_items", (table) => {
    table.integer("transaction_id").unsigned().nullable().alter();
    table.integer("warehouse_asset_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("asset_lifecycle", (table) => {
    table.integer("transaction_id").unsigned().nullable().alter();
    table.integer("receiver_id").unsigned().nullable().alter();
  });

  await knex.schema.alterTable("asset_maintenances", (table) => {
    table.integer("transaction_id").unsigned().nullable().alter();
  });

  // advisor_requests.class_id → cần nullable để dùng SET NULL
  await knex.schema.alterTable("advisor_requests", (table) => {
    table.integer("class_id").unsigned().nullable().alter();
  });
  // Nguyen tac xoa:
  // - SET NULL: giu lai ban ghi lich su, chi bo lien ket toi ban ghi cha da bi xoa vat ly.
  // - CASCADE: xoa bang con/bang noi vi no phu thuoc truc tiep vao ban ghi cha.
  // - RESTRICT: chan xoa cha khi con du lieu nghiep vu dang tham chieu.
  // --- users ---
  await knex.schema.alterTable("users", (table) => {
    table.foreign("role_id").references("id").inTable("roles").onDelete("SET NULL");
    table.foreign("class_id").references("id").inTable("classes").onDelete("SET NULL");
    table.foreign("major_id").references("id").inTable("majors").onDelete("SET NULL");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- roles ---
  await knex.schema.alterTable("roles", (table) => {
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- permissions ---
  await knex.schema.alterTable("permissions", (table) => {
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- categories ---
  await knex.schema.alterTable("categories", (table) => {
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- assets ---
  await knex.schema.alterTable("assets", (table) => {
    // Khong cho xoa category neu van con asset thuoc category do.
    table.foreign("category_id").references("id").inTable("categories").onDelete("RESTRICT");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- warehouses ---
  await knex.schema.alterTable("warehouses", (table) => {
    table.foreign("address_id").references("id").inTable("address").onDelete("SET NULL");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- warehouse_user ---
  await knex.schema.alterTable("warehouse_user", (table) => {
    // Bang noi user-kho: xoa user/kho thi xoa dong phan cong tuong ung.
    table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("warehouse_id").references("id").inTable("warehouses").onDelete("CASCADE");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- warehouse_asset ---
  await knex.schema.alterTable("warehouse_asset", (table) => {
    // Lo ton phu thuoc vao ca loai tai san va kho vat ly.
    table.foreign("asset_id").references("id").inTable("assets").onDelete("CASCADE");
    table.foreign("warehouse_id").references("id").inTable("warehouses").onDelete("CASCADE");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- asset_transactions ---
  await knex.schema.alterTable("asset_transactions", (table) => {
    // Giao dich la lich su, nen xoa kho chi set warehouse_id = NULL thay vi xoa phieu.
    table.foreign("warehouse_id").references("id").inTable("warehouses").onDelete("SET NULL");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- asset_imports ---
  await knex.schema.alterTable("asset_imports", (table) => {
    table.foreign("transaction_id").references("id").inTable("asset_transactions").onDelete("CASCADE");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- asset_exports ---
  await knex.schema.alterTable("asset_exports", (table) => {
    table.foreign("transaction_id").references("id").inTable("asset_transactions").onDelete("CASCADE");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- asset_transaction_items ---
  await knex.schema.alterTable("asset_transaction_items", (table) => {
    // Dong hang phu thuoc vao phieu; xoa phieu thi xoa dong hang.
    table.foreign("transaction_id").references("id").inTable("asset_transactions").onDelete("CASCADE");
    // Dong hang tro toi lo ton cu the, de biet tai san nao va kho nao bi tac dong.
    table.foreign("warehouse_asset_id").references("id").inTable("warehouse_asset").onDelete("CASCADE");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- asset_lifecycle ---
  await knex.schema.alterTable("asset_lifecycle", (table) => {
    table.foreign("transaction_id").references("id").inTable("asset_transactions").onDelete("CASCADE");
    table.foreign("receiver_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- asset_maintenances ---
  await knex.schema.alterTable("asset_maintenances", (table) => {
    table.foreign("transaction_id").references("id").inTable("asset_transactions").onDelete("CASCADE");
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });

  // --- kqn_logs ---
  await knex.schema.alterTable("kqn_logs", (table) => {
    table.foreign("action_id").references("id").inTable("log_actions").onDelete("CASCADE");
    table.foreign("controller_id").references("id").inTable("log_controllers").onDelete("SET NULL");
  });

  // --- advisor_requests ---
  await knex.schema.alterTable("advisor_requests", (table) => {
    // Yeu cau phu thuoc vao nguoi gui; cac tham chieu lop/sinh vien/tai san/kho duoc SET NULL de giu lich su.
    table.foreign("advisor_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("class_id").references("id").inTable("classes").onDelete("SET NULL");
    table.foreign("student_id").references("id").inTable("students").onDelete("SET NULL");
    table.foreign("asset_id").references("id").inTable("assets").onDelete("SET NULL");
    table.foreign("processed_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("warehouse_id").references("id").inTable("warehouses").onDelete("SET NULL");
  });

  // --- address ---
  await knex.schema.alterTable("address", (table) => {
    table.foreign("created_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("modified_by_user_id").references("id").inTable("users").onDelete("SET NULL");
    table.foreign("deleted_by_user_id").references("id").inTable("users").onDelete("SET NULL");
  });
}

export async function down(knex: Knex): Promise<void> {

  // Rollback thao FK theo thu tu nguoc de khong vi pham rang buoc khi quay lui migration.
  // --- address ---
  await knex.schema.alterTable("address", (table) => {
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- advisor_requests ---
  await knex.schema.alterTable("advisor_requests", (table) => {
    table.dropForeign(["advisor_id"]);
    table.dropForeign(["class_id"]);
    table.dropForeign(["student_id"]);
    table.dropForeign(["asset_id"]);
    table.dropForeign(["processed_by_user_id"]);
    table.dropForeign(["warehouse_id"]);
  });

  // --- kqn_logs ---
  await knex.schema.alterTable("kqn_logs", (table) => {
    table.dropForeign(["action_id"]);
    table.dropForeign(["controller_id"]);
  });

  // --- asset_maintenances ---
  await knex.schema.alterTable("asset_maintenances", (table) => {
    table.dropForeign(["transaction_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- asset_lifecycle ---
  await knex.schema.alterTable("asset_lifecycle", (table) => {
    table.dropForeign(["transaction_id"]);
    table.dropForeign(["receiver_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- asset_transaction_items ---
  await knex.schema.alterTable("asset_transaction_items", (table) => {
    table.dropForeign(["transaction_id"]);
    table.dropForeign(["warehouse_asset_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- asset_exports ---
  await knex.schema.alterTable("asset_exports", (table) => {
    table.dropForeign(["transaction_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- asset_imports ---
  await knex.schema.alterTable("asset_imports", (table) => {
    table.dropForeign(["transaction_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- asset_transactions ---
  await knex.schema.alterTable("asset_transactions", (table) => {
    table.dropForeign(["warehouse_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- warehouse_asset ---
  await knex.schema.alterTable("warehouse_asset", (table) => {
    table.dropForeign(["asset_id"]);
    table.dropForeign(["warehouse_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- warehouse_user ---
  await knex.schema.alterTable("warehouse_user", (table) => {
    table.dropForeign(["user_id"]);
    table.dropForeign(["warehouse_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- warehouses ---
  await knex.schema.alterTable("warehouses", (table) => {
    table.dropForeign(["address_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- assets ---
  await knex.schema.alterTable("assets", (table) => {
    table.dropForeign(["category_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- categories ---
  await knex.schema.alterTable("categories", (table) => {
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- permissions ---
  await knex.schema.alterTable("permissions", (table) => {
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- roles ---
  await knex.schema.alterTable("roles", (table) => {
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

  // --- users ---
  await knex.schema.alterTable("users", (table) => {
    table.dropForeign(["role_id"]);
    table.dropForeign(["class_id"]);
    table.dropForeign(["major_id"]);
    table.dropForeign(["created_by_user_id"]);
    table.dropForeign(["modified_by_user_id"]);
    table.dropForeign(["deleted_by_user_id"]);
  });

}
