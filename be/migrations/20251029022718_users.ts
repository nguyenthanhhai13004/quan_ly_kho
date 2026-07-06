import type { Knex } from "knex";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";
import UserStatusEnum from "../src/v1/cores/enums/user-status.enum";

// Migration khoi tao bang users.
// Bang nay luu tai khoan dang nhap, thong tin ca nhan, trang thai khoa/mo khoa,
// so lan dang nhap sai va cac cot audit de biet ai tao/sua/xoa mem ban ghi.
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(USER_TABLE_NAME, (table) => {
    // Khoa chinh dai dien cho moi tai khoan trong he thong.
    table.increments("id").primary().unique();
    table.string("username").notNullable();
    table.string("fullname").notNullable();
    table.string("phone_number").nullable();
    table.string("address").nullable();
    table.string("email").notNullable();
    table.string("password").notNullable();

    table.integer("failed_login_attempts").notNullable().defaultTo(0);
    table.dateTime("last_failed_login_at").nullable();

    table.boolean("is_active").defaultTo(UserStatusEnum.ACTIVE);

    // role_id duoc tao truoc, FK toi roles se duoc bo sung o migration rang buoc sau.
    table.integer("role_id")

    // Cac cot audit deu tro ve users.id sau khi migration FK tong hop duoc chay.
    table.integer("created_by_user_id").nullable().unsigned();
    table.integer("modified_by_user_id").nullable().unsigned();
    table.integer("deleted_by_user_id").nullable().unsigned();

    table.dateTime("created_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("updated_at").notNullable().defaultTo(knex.fn.now());
    table.dateTime("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Rollback xoa bang users neu can quay lui migration.
  return knex.schema.dropTableIfExists(USER_TABLE_NAME);
}
