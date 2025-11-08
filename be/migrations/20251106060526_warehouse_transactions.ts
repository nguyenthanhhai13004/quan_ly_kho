import type { Knex } from "knex";
import { WAREHOUSE_TRANSACTIONS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(WAREHOUSE_TRANSACTIONS_TABLE_NAME, (table) => {
        table.increments("id").primary().unique();
        table.integer("asset_id").notNullable();
        table.integer("warehouse_id").notNullable();
        table.string("reason").nullable();
        table.string("note").nullable();

        table.integer("created_by_user_id").nullable().unsigned();
        table.integer("modified_by_user_id").nullable().unsigned();
        table.integer("deleted_by_user_id").nullable().unsigned();
    
        table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
        table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
        table.dateTime("deleted_at").nullable();
    })
}


export async function down(knex: Knex): Promise<void> {
}

