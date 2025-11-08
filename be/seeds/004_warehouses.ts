import { Knex } from "knex";
import { WAREHOUSE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const WAREHOUSES_DEFAULT = [
  { id: 1, name: "Kho Quân nhu Trung ương", code: "QN-TW" },
  { id: 2, name: "Kho Quân nhu Khu vực Miền Bắc", code: "QN-MB" },
  { id: 3, name: "Kho Quân nhu Khu vực Miền Trung", code: "QN-MT" },
  { id: 4, name: "Kho Quân nhu Khu vực Miền Nam", code: "QN-MN" },
  { id: 5, name: "Kho Quân nhu Tổng cục Hậu cần", code: "QN-TCHC" },
  { id: 6, name: "Kho Quân nhu Cục Kỹ thuật", code: "QN-CKT" },
  { id: 7, name: "Kho Quân nhu Học viện Quốc phòng", code: "QN-HVQP" },
  { id: 8, name: "Kho Quân nhu Sư đoàn 312", code: "QN-SD312" },
  { id: 9, name: "Kho Quân nhu Sư đoàn 5", code: "QN-SD5" },
  { id: 10, name: "Kho Quân nhu Dự trữ Chiến lược", code: "QN-DTCL" },
];
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(WAREHOUSE_TABLE_NAME).del();

  // Inserts seed entries
  await knex(WAREHOUSE_TABLE_NAME).insert(WAREHOUSES_DEFAULT);
}
