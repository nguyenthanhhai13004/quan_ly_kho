import type { Knex } from "knex";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";
import UserStatusEnum from "../src/v1/cores/enums/user-status.enum";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(USER_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("username").notNullable();
    table.string("fullname").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();

    table.integer("failed_login_attempts").notNullable().defaultTo(0);
    table.dateTime("last_failed_login_at").nullable();

    table.boolean("is_active").defaultTo(UserStatusEnum.ACTIVE);

    table.integer("role_id")

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists(USER_TABLE_NAME);
}
