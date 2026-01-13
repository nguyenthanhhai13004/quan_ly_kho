import type { Knex } from "knex";
import { ASSET_LIFECYCLE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ASSET_LIFECYCLE_TABLE_NAME, (table) => {
    table.increments("id").primary(); // id auto-increment
    table.integer("transaction_id");

    table.timestamp("allocation_date").nullable(); // ngày cấp phát
    table.timestamp("return_deadline").nullable(); // hạn thu hồi
    table.integer("receiver_id").nullable(); // người nhận/đơn vị nhận
    table.date("return_date").nullable(); // ngày thu hồi
    table.date("disposal_date").nullable(); // ngày thanh lý

    // audit fields
    table.integer("created_by_user_id").unsigned();
    table.integer("modified_by_user_id").unsigned();
    table.integer("deleted_by_user_id").unsigned();

    // timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(ASSET_LIFECYCLE_TABLE_NAME);
}
