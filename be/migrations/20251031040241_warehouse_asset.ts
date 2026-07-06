import type { Knex } from "knex";
import { ASSET_TABLE_NAME, WAREHOUSE_ASSET_TABLE_NAME, WAREHOUSE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";
import AssetStatusEnum from "../src/v1/cores/enums/assets-status.enum";

// Migration tao bang warehouse_asset.
// Day la bang ton kho thuc te theo lo: tai san nao, o kho nao, so luong bao nhieu,
// trang thai, han dung, ngay san xuat, lich bao tri va gia tri cua lo.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(WAREHOUSE_ASSET_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    // asset_id + warehouse_id se tro toi assets va warehouses sau khi bo sung FK.
    table.integer("asset_id").unsigned().notNullable();
    table.integer("warehouse_id").unsigned().notNullable();
    table.integer("quantity").defaultTo(0);
    // table.dateTime("import_date").notNullable().defaultTo(knex.fn.now());
    table.dateTime("maintenance_due").nullable().defaultTo(knex.fn.now());
    table.integer("status").defaultTo(AssetStatusEnum.GOOD);
    table.string("batch_code").notNullable();
    table.dateTime("expiration_date").nullable().defaultTo(knex.fn.now());
    table.dateTime("manufacture_date").nullable().defaultTo(knex.fn.now());
    table.integer("cost").defaultTo(0);


    // Audit cho biet ai tao/sua/xoa mem lo ton.
    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
    // Rollback xoa bang ton kho theo lo.
    await knex.schema.dropTableIfExists(WAREHOUSE_ASSET_TABLE_NAME);
}
