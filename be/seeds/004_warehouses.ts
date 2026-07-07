import { Knex } from "knex";
import { WAREHOUSE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

function generateSeedWarehouseCode(name: string): string {
  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim();

  const initials = normalize(name)
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase())
    .join("")
    .slice(0, 3);

  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `WH-${initials}-${datePart}-${randomPart}`;
}

const TEST_ADDRESS = {
    id: 1,
    address_detail: "Số 1, đường Trần Phú, Ba Đình, Hà Nội",
    latitude: 21.033333,
    longitude: 105.850000,
  }

export const WAREHOUSES_DEFAULT = [
  { id: 1,  name: "Kho Quân nhu Trung ương",          code: "QN-TW",    address_id:1},
  { id: 2,  name: "Kho Quân nhu Khu vực Miền Bắc",    code: "QN-MB",    address_id:1 },
  { id: 3,  name: "Kho Quân nhu Khu vực Miền Trung",  code: "QN-MT",    address_id:1},
  { id: 4,  name: "Kho Quân nhu Khu vực Miền Nam",    code: "QN-MN",    address_id:1 },
  { id: 5,  name: "Kho Quân nhu Tổng cục Hậu cần",    code: "QN-TCHC",  address_id:1 },
  { id: 6,  name: "Kho Quân nhu Cục Kỹ thuật",        code: "QN-CKT",   address_id:1 },
  { id: 7,  name: "Kho Quân Nhu Học viện Khoa Học Quân Sự", code: "QN-HVKHQS",  address_id:1},
  { id: 8,  name: "Kho Quân nhu Sư đoàn 312",        code: "QN-SD312", address_id:1},
  { id: 9,  name: "Kho Quân nhu Sư đoàn 5",          code: "QN-SD5",   address_id:1 },
  { id: 10, name: "Kho Quân nhu Dự trữ Chiến lược",  code: "QN-DTCL",  address_id:1},
  { id: 11, name: "Kho Quân nhu Bộ Tư lệnh Thủ đô",  code: "QN-BTLTD", address_id:1},
  { id: 12, name: "Kho Quân nhu Quân khu 1",         code: "QN-QK1",   address_id:1},
  { id: 13, name: "Kho Quân nhu Quân khu 2",         code: "QN-QK2",   address_id:1},
  { id: 14, name: "Kho Quân nhu Quân khu 3",         code: "QN-QK3",   address_id:1},
  { id: 15, name: "Kho Quân nhu Quân khu 4",         code: "QN-QK4",   address_id:1},
  { id: 16, name: "Kho Quân nhu Quân khu 5",         code: "QN-QK5",   address_id:1},
  { id: 17, name: "Kho Quân nhu Quân khu 7",         code: "QN-QK7",   address_id:1},
  { id: 18, name: "Kho Quân nhu Quân khu 9",         code: "QN-QK9",   address_id:1},
  { id: 19, name: "Kho Quân nhu Lữ đoàn 144",        code: "QN-LD144", address_id:1},
  { id: 20, name: "Kho Quân nhu Trung tâm Huấn luyện Quốc gia", code: "QN-TTHLQG", address_id:1},
].map((warehouse) => ({
  ...warehouse,
  code: generateSeedWarehouseCode(warehouse.name),
}));

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
