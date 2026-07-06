import type { Knex } from "knex";
import { WAREHOUSE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration tao bang warehouses.
// Bang nay luu thong tin kho vat ly; hang ton trong kho nam o warehouse_asset.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(WAREHOUSE_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable();
    table.string("code").nullable();
    // address_id se tro toi bang address sau khi bo sung FK tong hop.
    table.integer("address_id").nullable();

    // Audit cho biet ai tao/sua/xoa mem kho.
    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback xoa bang kho.
  await knex.schema.dropTableIfExists(WAREHOUSE_TABLE_NAME);
}
