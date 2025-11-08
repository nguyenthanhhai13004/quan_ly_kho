import { Knex } from "knex";
import { hashPassword } from "../src/v1/auths/utils";
import { USER_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(USER_TABLE_NAME).del();
  const DEFAULT_PASSWORD = "12345678";
  const DEFAULT_PASSWORD_HASH = await hashPassword(DEFAULT_PASSWORD);

  // Inserts seed entries
  await knex(USER_TABLE_NAME).insert([
     {
      id: 1,
      fullname: "Super Admin",
      email: "super.admin@gmail.com",
      username: "super",
      password: DEFAULT_PASSWORD_HASH,
      role_id: 1,
    },
    {
      id: 2,
      fullname: "Admin",
      email: "admin@example.com",
      username: "admin",
      password: DEFAULT_PASSWORD_HASH,
      role_id: 2,
    },
    {
      id: 3,
      fullname: "John Doe",
      email: "john@example.com",
      username: "warehouse-officer",
      password: DEFAULT_PASSWORD_HASH,
      role_id:3
    },
    {
      id: 4,
      fullname: "Jane Smith",
      email: "jane@example.com",
      username: "user",
      password: DEFAULT_PASSWORD_HASH,
      role_id:4,
    },
    {
      id: 5,
      fullname: "Jane Smith",
      email: "aloo@example.com",
      username: "test1",
      password: DEFAULT_PASSWORD_HASH,
      role_id:4
    },
  ]);
}
