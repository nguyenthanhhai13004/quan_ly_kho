import type { Knex } from "knex";
import { MAJORS_TABLE_NAME, CLASSES_TABLE_NAME, STUDENTS_TABLE_NAME, ROLE_TABLE_NAME, ROLE_PERMISSION_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

// Migration them nhom hoc vu: majors, classes, students.
// Dong thoi bo role "user" cu de chuyen sang mo hinh admin/can-bo-kho/commander.
export async function up(knex: Knex): Promise<void> {
  // Remove "user" role and its permissions (if exists)
  // Assuming role id 3 is "user" based on previous seed
  await knex(ROLE_PERMISSION_TABLE_NAME).where('role_id', 3).del();
  await knex(ROLE_TABLE_NAME).where('id', 3).del();

  // Create Majors Table
  // majors dai dien he/nganh dao tao ma commander phu trach.
  await knex.schema.createTable(MAJORS_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.string("name").notNullable();
    table.string("code").notNullable().unique();
    table.text("description").nullable();
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  // Create Classes Table
  // classes thuoc majors; xoa major thi xoa cac lop trong major do.
  await knex.schema.createTable(CLASSES_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.integer("major_id").notNullable().unsigned().references("id").inTable(MAJORS_TABLE_NAME).onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("code").notNullable().unique();
    table.text("description").nullable();
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  // Create Students Table
  // students thuoc classes; xoa lop thi xoa sinh vien cua lop.
  await knex.schema.createTable(STUDENTS_TABLE_NAME, (table) => {
    table.increments("id").primary().unique();
    table.integer("class_id").notNullable().unsigned().references("id").inTable(CLASSES_TABLE_NAME).onDelete("CASCADE");
    table.string("student_code").notNullable().unique();
    table.string("fullname").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable(); // hashed
    table.string("phone_number").nullable();
    table.boolean("is_active").defaultTo(true);
    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Xoa theo thu tu nguoc vi students phu thuoc classes, classes phu thuoc majors.
  await knex.schema.dropTableIfExists(STUDENTS_TABLE_NAME);
  await knex.schema.dropTableIfExists(CLASSES_TABLE_NAME);
  await knex.schema.dropTableIfExists(MAJORS_TABLE_NAME);

  // Restore User role (id: 3, name: "Người dùng", code: "user")
  await knex(ROLE_TABLE_NAME).insert({
    id: 3,
    name: "Người dùng",
    code: "user",
    description: "người dùng",
  });
  // Note: permissions are not restored here, typically down migration is best effort
}

