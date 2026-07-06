import type { Knex } from "knex";

// Migration tao bang address.
// Bang nay luu dia chi cu the va toa do; warehouses.address_id se tro ve bang nay.
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("address", (table) => {
    table.bigIncrements("id").primary();

    // Ban dau co du kien luu ma tinh/huyen/xa truc tiep, nhung sau chuyen sang address_detail + toa do.
    // table.string("province_code", 20).notNullable();
    // table.string("district_code", 20).notNullable();
    // table.string("ward_code", 20).notNullable();

    table.string("address_detail", 255).notNullable();

    table.decimal("latitude", 10, 7).nullable();
    table.decimal("longitude", 10, 7).nullable();

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback xoa bang dia chi.
  await knex.schema.dropTableIfExists("address");
}
