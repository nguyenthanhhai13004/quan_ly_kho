import {
  PERMISSION_TABLE_NAME,
  ROLE_PERMISSION_TABLE_NAME,
} from "../cores/constants/table-name.constant";
import db from "../databases/init.mysql-v2";
import { Permission } from "../models/permission.model";
class PermissionRepository {
  async findById(id: number): Promise<Permission | null> {
    const permission = await db<Permission>(PERMISSION_TABLE_NAME)
      .where("id", id)
      .first();
    return permission || null;
  }

  async findAllByRoleId(roleId: number): Promise<Permission[]> {
    const perms = await db(PERMISSION_TABLE_NAME)
      .innerJoin(
        ROLE_PERMISSION_TABLE_NAME,
        `${PERMISSION_TABLE_NAME}.id`,
        `${ROLE_PERMISSION_TABLE_NAME}.permission_id`,
      )
      .where(`${ROLE_PERMISSION_TABLE_NAME}.role_id`, roleId)
      .select(`${PERMISSION_TABLE_NAME}.*`);

    return perms;
  }

  async findAll(): Promise<Permission[]>{
    const permissions = await db<Permission>(PERMISSION_TABLE_NAME);
    return permissions;
  }
}
export default new PermissionRepository();
