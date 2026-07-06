import type { Knex } from "knex";
import { CATEGORY_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";


// Migration tao bang categories.
// Bang nay la danh muc phan nhom tai san, vi du vu khi, phuong tien, vat tu tieu hao.
export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(CATEGORY_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable();
    table.string("code").notNullable();
    table.string("description").nullable();
    table.string("color").notNullable();


    // Audit cho biet ai tao/sua/xoa mem danh muc.
    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}


export async function down(knex: Knex): Promise<void> {
    // Rollback xoa bang danh muc tai san.
    return knex.schema.dropTableIfExists(CATEGORY_TABLE_NAME);
}

