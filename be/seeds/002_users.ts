import { Knex } from "knex";
import { hashPassword } from "../src/v1/auths/utils";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(USER_TABLE_NAME).del();
  const DEFAULT_PASSWORD = "12345678";
  const DEFAULT_PASSWORD_HASH = await hashPassword(DEFAULT_PASSWORD);
  // const testManyUsers = 1000;
  // const users = [];
  // for (let i = 0; i < testManyUsers; i++) {
  //   // await knex(USER_TABLE_NAME).insert({
  //   //   id: i + 5,
  //   //   fullname: `Test User ${i + 1}`,
  //   //   email: `testuser${i+1}@example.com`,
  //   //   username: `testuser${i+1}`,
  //   //   password: DEFAULT_PASSWORD_HASH,
  //   //   role_id: 3,
  //   //   phone_number:"0999999996"
  //   // });
  //   users.push({
  //     id: i + 5,
  //     fullname: `Test User ${i + 1}`,
  //     email: `testuser${i+1}@example.com`,
  //     username: `testuser${i+1}`,
  //     password: DEFAULT_PASSWORD_HASH,
  //     role_id: 3,
  //     phone_number:"0999999996"
  //   });
  // }

  // await knex(USER_TABLE_NAME).insert(users);

  // Inserts seed entries
  await knex(USER_TABLE_NAME).insert([
    {
      id: 1,
      fullname: "Admin",
      email: "admin@gmail.com",
      username: "admin",
      password: DEFAULT_PASSWORD_HASH,
      role_id: 1,
      phone_number:"0912345678"
    },
    {
      id: 2,
      fullname: "Nguyễn Thanh Hải",
      email: "nguyenthanhhai@gmail.com",
      username: "canbokho1",
      password: DEFAULT_PASSWORD_HASH,
      role_id:2,
      phone_number:"0923456789"
    },
    {
      id: 3,
      fullname: "Lê Thị Hương",
      email: "lethihuong@gmail.com",
      username: "canbokho2",
      password: DEFAULT_PASSWORD_HASH,
      role_id:2,
      phone_number:"0934567890"
    },
    {
      id: 4,
      fullname: "Phạm Minh Tuấn",
      email: "phamminhtuan@gmail.com",
      username: "user",
      password: DEFAULT_PASSWORD_HASH,
      role_id:3,
      phone_number:"0945678901"
    },
  ]);
}
