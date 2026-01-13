import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("address", (table) => {
    table.bigIncrements("id").primary();

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
  await knex.schema.dropTableIfExists("address");
}
