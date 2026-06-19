import { Knex } from "knex";
import { CATEGORY_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const CATEGORIES_DEFAULT = [
  {
    id:1,
    name: "Vũ khí",
    description: "Bao gồm các loại súng, đạn, dao găm, lựu đạn huấn luyện và vũ khí chuyên dụng.",
    color: "#DC2626",
    code:"VK"
  },
  {
    id:2,
    name: "Phương tiện",
    description: "Phương tiện cơ giới và vận chuyển như xe tải, xe jeep, xe bọc thép.",
    color: "#2563EB",
    code:"PT"
  },
  {
    id:3,
    name: "Thiết bị CNTT",
    description: "Máy tính, máy in, thiết bị mạng và các hệ thống công nghệ thông tin khác.",
    color: "#16A34A",
    code:"TB-CNTT"
  },
  {
    id:4,
    name: "Đồng phục",
    description: "Trang phục, giày mũ, phụ kiện mặc trong và ngoài nhiệm vụ.",
    color: "#F59E0B",
    code:"DP"
  },
  {
    id:5,
    name: "Vật tư tiêu hao",
    description: "Các loại vật tư dùng một lần hoặc tiêu hao như pin, giấy, mực in, nhiên liệu.",
    color: "#6B7280",
    code:"VTTH"
  }
];
export async function seed(knex: Knex): Promise<void> {
    await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
    // Deletes ALL existing entries
    await knex(CATEGORY_TABLE_NAME).del();

    // Inserts seed entries
    await knex(CATEGORY_TABLE_NAME).insert(CATEGORIES_DEFAULT);
    await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
};
