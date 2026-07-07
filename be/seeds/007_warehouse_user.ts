import { Knex } from "knex";
import { WAREHOUSE_USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const WAREHOUSE_MANAGER_ASSIGNMENTS = [
  { warehouse_id: 1, user_ids: [2, 13] },
  { warehouse_id: 2, user_ids: [5, 14] },
  { warehouse_id: 3, user_ids: [6, 15] },
  { warehouse_id: 4, user_ids: [7, 16] },
  { warehouse_id: 5, user_ids: [3, 17] },
  { warehouse_id: 6, user_ids: [8, 15] },
  // Kho id 7 la Kho Quan Nhu Hoc vien Khoa Hoc Quan Su, de trong quan ly.
  { warehouse_id: 8, user_ids: [10, 14] },
  { warehouse_id: 9, user_ids: [11, 16] },
  { warehouse_id: 10, user_ids: [12, 17] },
  { warehouse_id: 11, user_ids: [13] },
  { warehouse_id: 12, user_ids: [2, 5] },
  { warehouse_id: 13, user_ids: [6] },
  { warehouse_id: 14, user_ids: [10] },
  { warehouse_id: 15, user_ids: [11] },
  { warehouse_id: 16, user_ids: [8] },
  { warehouse_id: 17, user_ids: [7] },
  { warehouse_id: 18, user_ids: [12] },
  { warehouse_id: 19, user_ids: [3] },
  { warehouse_id: 20, user_ids: [9] },
];

export const USER_WAREHOUSES_DEFAULT = WAREHOUSE_MANAGER_ASSIGNMENTS.flatMap(
  ({ warehouse_id, user_ids }) =>
    user_ids.map((user_id) => ({ user_id, warehouse_id })),
);

export async function seed(knex: Knex): Promise<void> {
  await knex.raw("SET FOREIGN_KEY_CHECKS = 0");
  await knex(WAREHOUSE_USER_TABLE_NAME).del();
  await knex(WAREHOUSE_USER_TABLE_NAME).insert(USER_WAREHOUSES_DEFAULT);
  await knex.raw("SET FOREIGN_KEY_CHECKS = 1");
}
