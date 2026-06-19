import { Knex } from "knex";
import { WAREHOUSE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const TEST_ADDRESS = {
    id: 1,
    address_detail: "Số 1, đường Trần Phú, Ba Đình, Hà Nội",
    latitude: 21.033333,
    longitude: 105.850000,
  }

const WAREHOUSES_DEFAULT = [
  { id: 1,  name: "Kho Quân nhu Trung ương",          code: "QN-TW",    address_id:1},
  { id: 2,  name: "Kho Quân nhu Khu vực Miền Bắc",    code: "QN-MB",    address_id:1 },
  { id: 3,  name: "Kho Quân nhu Khu vực Miền Trung",  code: "QN-MT",    address_id:1},
  { id: 4,  name: "Kho Quân nhu Khu vực Miền Nam",    code: "QN-MN",    address_id:1 },
  { id: 5,  name: "Kho Quân nhu Tổng cục Hậu cần",    code: "QN-TCHC",  address_id:1 },
  { id: 6,  name: "Kho Quân nhu Cục Kỹ thuật",        code: "QN-CKT",   address_id:1 },
  { id: 7,  name: "Kho Quân nhu Học viện Quốc phòng", code: "QN-HVQP",  address_id:1},
  { id: 8,  name: "Kho Quân nhu Sư đoàn 312",        code: "QN-SD312", address_id:1},
  { id: 9,  name: "Kho Quân nhu Sư đoàn 5",          code: "QN-SD5",   address_id:1 },
  { id: 10, name: "Kho Quân nhu Dự trữ Chiến lược",  code: "QN-DTCL",  address_id:1},
];

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  // Xóa theo thứ tự FK
  await knex(WAREHOUSE_TABLE_NAME).del();
  await knex("address").del();

  // Insert addresses trước
  await knex("address").insert(TEST_ADDRESS);

  // Insert warehouses sau
  await knex(WAREHOUSE_TABLE_NAME).insert(WAREHOUSES_DEFAULT);
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
}