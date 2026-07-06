import type { Knex } from "knex";
import { ASSET_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";
import AssetStatusEnum from "../src/v1/cores/enums/assets-status.enum";


// Migration tao bang assets.
// assets chi la catalog/loai tai san; so luong ton kho thuc te nam o bang warehouse_asset.
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(ASSET_TABLE_NAME, (table) => {
        table.increments("id").primary().unique();
        table.string("name").notNullable();
        table.string("code").nullable();
        table.string("description").nullable();
        table.string("image_url").nullable();
        // table.integer("cost").defaultTo(0);

        // FK toi categories se duoc bo sung o migration rang buoc sau.
        table.integer("category_id").notNullable();

        // Cac cot status, ngay nhap, lich bao tri da duoc dua sang warehouse_asset vi chung phu thuoc tung lo trong kho.
        // table.integer("status").defaultTo(AssetStatusEnum.ACTIVE);
        // table.dateTime("import_date ").notNullable().defaultTo(knex.fn.now());
        // table.dateTime("maintenance_due").notNullable().defaultTo(knex.fn.now());
    
        // Audit cho biet ai tao/sua/xoa mem loai tai san.
        table.integer("created_by_user_id").nullable().unsigned();
        table.integer("modified_by_user_id").nullable().unsigned();
        table.integer("deleted_by_user_id").nullable().unsigned();
    
        table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
        table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
        table.dateTime("deleted_at").nullable();
      });
}


export async function down(knex: Knex): Promise<void> {
    // Rollback xoa bang catalog tai san.
    await knex.schema.dropTableIfExists(ASSET_TABLE_NAME);
}

