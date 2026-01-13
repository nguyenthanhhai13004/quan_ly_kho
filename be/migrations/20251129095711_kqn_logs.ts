import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("log_actions", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 50).notNullable()
    table.string("code", 50).notNullable().unique();
    table.string("description", 255).nullable()
  });

  await knex.schema.createTable("log_controllers", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 50).notNullable()
    table.string("code", 100).notNullable().unique();
    table.string("description", 255).nullable()
  });

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
  await knex.schema.dropTableIfExists("kqn_logs");
  await knex.schema.dropTableIfExists("log_controllers");
  await knex.schema.dropTableIfExists("log_actions");
}
