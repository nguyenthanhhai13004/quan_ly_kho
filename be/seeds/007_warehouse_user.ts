import { Knex } from "knex";
import { WAREHOUSE_USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const USER_WAREHOUSES_DEFAULT = [
  // === Super Admin (toàn quyền, quản lý tất cả kho) ===
  { user_id: 2, warehouse_id: 1 },
  { user_id: 2, warehouse_id: 2 },
  { user_id: 2, warehouse_id: 3 },
  { user_id: 2, warehouse_id: 4 },
  { user_id: 2, warehouse_id: 5 },
  { user_id: 2, warehouse_id: 6 },
  { user_id: 2, warehouse_id: 7 },
  { user_id: 2, warehouse_id: 8 },
  { user_id: 2, warehouse_id: 9 },
  { user_id: 2, warehouse_id: 10 },

  // === Admin (quản trị tổng, theo dõi khu vực chính) ===
  { user_id: 3, warehouse_id: 1 },
  { user_id: 3, warehouse_id: 5 },
  { user_id: 3, warehouse_id: 10 },

  // === Chỉ huy (chihuyk48) quản lý Kho Quân nhu Khu vực Miền Nam ===
  { user_id: 4, warehouse_id: 4 },
];

export async function seed(knex: Knex): Promise<void> {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    // Deletes ALL existing entries
    await knex(WAREHOUSE_USER_TABLE_NAME).del();

    // Inserts seed entries
    await knex(WAREHOUSE_USER_TABLE_NAME).insert(USER_WAREHOUSES_DEFAULT);
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
