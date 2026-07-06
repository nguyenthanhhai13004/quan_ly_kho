import type { Knex } from "knex";

// Migration tao nhom bang log he thong.
// log_actions va log_controllers la danh muc; kqn_logs la bang ghi nhat ky thao tac thuc te.
export async function up(knex: Knex): Promise<void> {
  // Danh muc hanh dong, vi du CREATE/UPDATE/DELETE/LOGIN.
  await knex.schema.createTable("log_actions", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 50).notNullable()
    table.string("code", 50).notNullable().unique();
    table.string("description", 255).nullable()
  });

  // Danh muc phan he/controller noi thao tac xay ra.
  await knex.schema.createTable("log_controllers", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 50).notNullable()
    table.string("code", 100).notNullable().unique();
    table.string("description", 255).nullable()
  });

  // Ban ghi log: ai thao tac, tren URL nao, du lieu gui len va thay doi khi sua.
  await knex.schema.createTable("kqn_logs", (table) => {
    table.bigIncrements("id").primary();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.string("username", 100).notNullable();

    table.bigInteger("action_id").unsigned().notNullable();      
    table.bigInteger("controller_id").unsigned().nullable();

    table.string("ip", 45).nullable();
    table.string("url", 500).nullable();
    table.json("data").nullable();
    table.json("edit_changes").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Xoa bang log thuc te truoc vi phu thuoc vao danh muc action/controller.
  await knex.schema.dropTableIfExists("kqn_logs");
  await knex.schema.dropTableIfExists("log_controllers");
  await knex.schema.dropTableIfExists("log_actions");
}
