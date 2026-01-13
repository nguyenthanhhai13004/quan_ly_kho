import { Knex } from "knex";
import { WAREHOUSE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

const ADDRESSES = [
  {
    id: 1,
    address_detail: "Số 45, đường Lê Lợi, Quận 1, TP.HCM",
    latitude: 10.776722,
    longitude: 106.699028,
  },
  {
    id: 2,
    address_detail: "Số 12, đường Trần Hưng Đạo, Ba Đình, Hà Nội",
    latitude: 21.034722,
    longitude: 105.848333,
  },
  {
    id: 3,
    address_detail: "Số 88, đường Nguyễn Huệ, Hải Châu, Đà Nẵng",
    latitude: 16.078056,
    longitude: 108.221944,
  },
  {
    id: 4,
    address_detail: "Số 56, đường Lê Văn Sỹ, Phú Nhuận, TP.HCM",
    latitude: 10.804444,
    longitude: 106.704167,
  },
  {
    id: 5,
    address_detail: "Số 23, đường Tây Sơn, Đống Đa, Hà Nội",
    latitude: 21.019722,
    longitude: 105.825833,
  },
  {
    id: 6,
    address_detail: "Số 134, đường Lê Thanh Tôn, Quận 1, TP.HCM",
    latitude: 10.771389,
    longitude: 106.696111,
  },
  {
    id: 7,
    address_detail: "Số 78, đường Bà Trieu, Hoàn Kiếm, Hà Nội",
    latitude: 21.019167,
    longitude: 105.850556,
  },
  {
    id: 8,
    address_detail: "Số 99, đường Trường Chinh, Thanh Xuân, Hà Nội",
    latitude: 21.007222,
    longitude: 105.825000,
  },
]

const WAREHOUSES_DEFAULT = [
  { id: 1,  name: "Kho Hàng Trung Tâm TP.HCM",        code: "KH-TTSGN",    address_id:1},
  { id: 2,  name: "Kho Hàng Hà Nội",                  code: "KH-HN",      address_id:2 },
  { id: 3,  name: "Kho Hàng Đà Nẵng",                 code: "KH-DN",      address_id:3},
  { id: 4,  name: "Kho Hàng Thành phố Hồ Chí Minh 2", code: "KH-TPHCM2",  address_id:4 },
  { id: 5,  name: "Kho Hàng Phụ trợ Hà Nội",          code: "KH-PTHN",    address_id:5 },
  { id: 6,  name: "Kho Hàng Phía Đông",               code: "KH-PD",      address_id:6},
  { id: 7,  name: "Kho Hàng Phía Tây Hà Nội",         code: "KH-PTXHN",   address_id:7},
  { id: 8,  name: "Kho Hàng Dự phòng",                code: "KH-DP",      address_id:8},
];

export async function seed(knex: Knex): Promise<void> {
  // Xóa theo thứ tự FK
  await knex(WAREHOUSE_TABLE_NAME).del();
  await knex("address").del();

  // Insert addresses trước
  await knex("address").insert(ADDRESSES);

  // Insert warehouses sau
  await knex(WAREHOUSE_TABLE_NAME).insert(WAREHOUSES_DEFAULT);
}