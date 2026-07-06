import { Knex } from "knex";
import { ASSET_TRANSACTIONS_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration tao bang asset_transactions.
// Day la bang header/phieu chung cho moi nghiep vu tai san: cap phat-thu hoi,
// thanh ly, nhap kho, xuat kho va bao tri.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ASSET_TRANSACTIONS_TABLE_NAME, (table) => {
    table.increments("id").primary();

    // code la ma phieu hien thi/tra cuu; unique index duoc them o migration harden sau.
    table.string("code").notNullable();
    table.string("name").notNullable();

    // Kho thuc hien giao dich; FK toi warehouses duoc them o migration rang buoc sau.
    table
      .integer("warehouse_id")

    // type xac dinh phieu thuoc luong nao: cap phat-thu hoi, thanh ly, nhap, xuat, bao tri.
    table.integer("type").notNullable(); // allocation, return, disposal, import, export...

    table.string("note");
    table.string("reason");

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
  // Rollback xoa bang phieu giao dich chung.
  await knex.schema.dropTableIfExists(ASSET_TRANSACTIONS_TABLE_NAME);
}
