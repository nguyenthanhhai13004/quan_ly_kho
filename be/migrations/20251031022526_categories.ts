import type { Knex } from "knex";
import { CATEGORY_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(CATEGORY_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable();
    table.string("description").nullable();
    table.string("color").notNullable();


    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists(CATEGORY_TABLE_NAME);
}

