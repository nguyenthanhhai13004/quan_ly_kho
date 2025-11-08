import { Knex } from "knex";
import { PERMISSION_TABLE_NAME, ROLE_PERMISSION_TABLE_NAME, ROLE_TABLE_NAME } from "../src/v1/cores/constants/table-name.constant";
import { PERMISSION_LIST_DEFAULT } from "../src/v1/cores/constants/permission.constant";
import { ROLE_LIST_DEFAULT } from "../src/v1/cores/constants/roles.constant";


export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(ROLE_PERMISSION_TABLE_NAME).del();
  await knex(ROLE_TABLE_NAME).del();
  await knex(PERMISSION_TABLE_NAME).del();

  // Inserts seed entries

  await knex(PERMISSION_TABLE_NAME).insert([...PERMISSION_LIST_DEFAULT]);
  await knex(ROLE_TABLE_NAME).insert([...ROLE_LIST_DEFAULT]);

  // for role_permission
  const rolePermissions = [];

  // SUPER ADMIN
  for (const perm of PERMISSION_LIST_DEFAULT) {
    rolePermissions.push({ role_id: 1, permission_id: perm.id });
  }

  for (const perm of PERMISSION_LIST_DEFAULT) {
    rolePermissions.push({ role_id: 2, permission_id: perm.id });
  }

  const officerPermissions = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16];
  for (const id of officerPermissions) {
    rolePermissions.push({ role_id: 3, permission_id: id });
  }

  const userPermissions = [14, 17];
  for (const id of userPermissions) {
    rolePermissions.push({ role_id: 4, permission_id: id });
  }

  await knex(ROLE_PERMISSION_TABLE_NAME).insert(rolePermissions);

}
