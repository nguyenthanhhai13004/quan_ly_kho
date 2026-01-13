import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("administrative_units", (table) => {
    table.integer("id").primary();
    table.string("full_name", 255);
    table.string("full_name_en", 255);
    table.string("short_name", 255);
    table.string("short_name_en", 255);
    table.string("code_name", 255);
    table.string("code_name_en", 255);

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });

  await knex.schema.createTable("provinces", (table) => {
    table.string("code", 20).primary();
    table.string("name", 255).notNullable();
    table.string("name_en", 255);
    table.string("full_name", 255).notNullable();
    table.string("full_name_en", 255);
    table.string("code_name", 255);

    table.integer("administrative_unit_id");
    table
      .foreign("administrative_unit_id")
      .references("id")
      .inTable("administrative_units")
      .onDelete("SET NULL");

    table.index(["administrative_unit_id"], "idx_provinces_unit");

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });

  await knex.schema.createTable("wards", (table) => {
    table.string("code", 20).primary();
    table.string("name", 255).notNullable();
    table.string("name_en", 255);
    table.string("full_name", 255);
    table.string("full_name_en", 255);
    table.string("code_name", 255);

    table.string("province_code", 20);
    table.integer("administrative_unit_id");

    table
      .foreign("province_code")
      .references("code")
      .inTable("provinces")
      .onDelete("SET NULL");

    table
      .foreign("administrative_unit_id")
      .references("id")
      .inTable("administrative_units")
      .onDelete("SET NULL");

    table.index(["province_code"], "idx_wards_province");
    table.index(["administrative_unit_id"], "idx_wards_unit");

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // ❗ Drop theo thứ tự ngược lại
  await knex.schema.dropTableIfExists("wards");
  await knex.schema.dropTableIfExists("provinces");
  await knex.schema.dropTableIfExists("administrative_units");
}
