import { Knex } from "knex";
import { WAREHOUSE_USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const USER_WAREHOUSES_DEFAULT = [
  // === Super Admin (toàn quyền, quản lý tất cả kho) ===
  { user_id: 1, warehouse_id: 1 },
  { user_id: 1, warehouse_id: 2 },
  { user_id: 1, warehouse_id: 3 },
  { user_id: 1, warehouse_id: 4 },
  { user_id: 1, warehouse_id: 5 },
  { user_id: 1, warehouse_id: 6 },
  { user_id: 1, warehouse_id: 7 },
  { user_id: 1, warehouse_id: 8 },
  { user_id: 1, warehouse_id: 9 },
  { user_id: 1, warehouse_id: 10 },

  // === Admin (quản trị tổng, theo dõi khu vực chính) ===
  { user_id: 2, warehouse_id: 1 },
  { user_id: 2, warehouse_id: 5 },
  { user_id: 2, warehouse_id: 10 },

  // === John Doe (Cán bộ kho) ===
  { user_id: 3, warehouse_id: 3 }, // Miền Trung
  { user_id: 3, warehouse_id: 4 }, // Miền Nam

  // === Jane Smith (User) ===
  { user_id: 4, warehouse_id: 7 }, // Học viện QP

  // === Jane Smith (test1 - User) ===
  { user_id: 5, warehouse_id: 8 }, // Sư đoàn 312
];

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(WAREHOUSE_USER_TABLE_NAME).del();

    // Inserts seed entries
    await knex(WAREHOUSE_USER_TABLE_NAME).insert(USER_WAREHOUSES_DEFAULT);
};
