import type { Knex } from "knex";
import { PERMISSION_TABLE_NAME, ROLE_PERMISSION_TABLE_NAME, ROLE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(ROLE_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable().unique();
    table.string("code").notNullable().unique();
    table.string("description");

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });

  await knex.schema.createTable(PERMISSION_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable().unique();
    table.string("code").notNullable().unique();
    table.string("description");

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });

  await knex.schema.createTable(ROLE_PERMISSION_TABLE_NAME, (table) => {
    table.integer("role_id").unsigned().notNullable();
    table.integer("permission_id").unsigned().notNullable();

    table.foreign("role_id").references("id").inTable("roles").onDelete("CASCADE");
    table.foreign("permission_id").references("id").inTable("permissions").onDelete("CASCADE");

    table.primary(["role_id", "permission_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(ROLE_PERMISSION_TABLE_NAME);
  await knex.schema.dropTableIfExists(ROLE_TABLE_NAME);
  await knex.schema.dropTableIfExists(PERMISSION_TABLE_NAME);
}

