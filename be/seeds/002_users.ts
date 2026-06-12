import { Knex } from "knex";
import { hashPassword } from "../src/v1/auths/utils";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(USER_TABLE_NAME).del();
  const DEFAULT_PASSWORD = "12345678";
  const DEFAULT_PASSWORD_HASH = await hashPassword(DEFAULT_PASSWORD);

  // Seed admin + cán bộ kho (no role 3/user anymore)
  await knex(USER_TABLE_NAME).insert([
    {
      id: 1,
      fullname: "Admin Hệ Thống",
      email: "admin@quannhu.vn",
      username: "admin",
      password: DEFAULT_PASSWORD_HASH,
      role_id: 1,
      phone_number: "0999999999",
    },
    {
      id: 2,
      fullname: "Nguyễn Văn Kho",
      email: "canbokho1@quannhu.vn",
      username: "canbokho1",
      password: DEFAULT_PASSWORD_HASH,
      role_id: 2,
      phone_number: "0999999998",
    },
    {
      id: 3,
      fullname: "Trần Thị Kho",
      email: "canbokho2@quannhu.vn",
      username: "canbokho2",
      password: DEFAULT_PASSWORD_HASH,
      role_id: 2,
      phone_number: "0999999997",
    },
    {
      id: 4,
      fullname: "Chỉ Huy Trưởng K48",
      email: "chihuyk48@quannhu.vn",
      username: "chihuyk48",
      password: DEFAULT_PASSWORD_HASH,
      role_id: 3,
      class_id: 1,
      phone_number: "0999999996",
    },
  ]);
}
