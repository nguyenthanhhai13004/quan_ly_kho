import type { Knex } from "knex";
import { PERMISSION_TABLE_NAME, ROLE_PERMISSION_TABLE_NAME, ROLE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration khoi tao RBAC: roles, permissions va bang noi role_permission.
// roles = vai tro nguoi dung; permissions = quyen chi tiet; role_permission = gan quyen cho vai tro.
export async function up(knex: Knex): Promise<void> {
    // Bang vai tro, vi du admin, warehouse-officer, commander.
    await knex.schema.createTable(ROLE_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable().unique();
    table.string("code").notNullable().unique();
    table.string("description");

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });

  // Bang danh muc quyen duoc code dung de chan/mo chuc nang.
  await knex.schema.createTable(PERMISSION_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable().unique();
    table.string("code").notNullable().unique();
    table.string("description");

    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });

  // Bang noi N-N: mot role co nhieu permission, mot permission co the thuoc nhieu role.
  await knex.schema.createTable(ROLE_PERMISSION_TABLE_NAME, (table) => {
    table.integer("role_id").unsigned().notNullable();
    table.integer("permission_id").unsigned().notNullable();

    // CASCADE chi xoa dong gan quyen trong bang noi, khong xoa ban ghi role/permission con lai.
    table.foreign("role_id").references("id").inTable("roles").onDelete("CASCADE");
    table.foreign("permission_id").references("id").inTable("permissions").onDelete("CASCADE");

    // Khoa chinh ghep dam bao moi cap role-permission chi ton tai mot lan.
    table.primary(["role_id", "permission_id"]);
  });
}


export async function down(knex: Knex): Promise<void> {
  // Xoa bang noi truoc vi no phu thuoc vao roles va permissions.
  await knex.schema.dropTableIfExists(ROLE_PERMISSION_TABLE_NAME);
  await knex.schema.dropTableIfExists(ROLE_TABLE_NAME);
  await knex.schema.dropTableIfExists(PERMISSION_TABLE_NAME);
}

