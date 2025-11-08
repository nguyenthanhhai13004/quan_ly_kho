import { ROLE_PERMISSION_TABLE_NAME, ROLE_TABLE_NAME } from "../cores/constants/table-name.constant";
import db from "../databases/init.mysql-v2";
import { Role } from "../models/role.model";
class RoleRepository {
  async findRoleById(id: number): Promise<Role | null> {
    const role = await db<Role>(ROLE_TABLE_NAME).where("id", id).first();
    return role || null;
  }

  async findRoleByName(name: string): Promise<Role | null> {
    const role = await db<Role>(ROLE_TABLE_NAME).where("name", name).first();
    return role || null;
  }
  
  async store(data: Partial<Role>):Promise<Role|null>{
    const [id] = await db(ROLE_TABLE_NAME).insert(data);
    const role = await db<Role>(ROLE_TABLE_NAME)
      .where({ id })
      .first();
    return role || null;
  }

  async findAll():Promise<Role[]>{
    const rows = await db(`${ROLE_TABLE_NAME} as r`)
    .leftJoin(`${ROLE_PERMISSION_TABLE_NAME} as rp`, "r.id", "rp.role_id")
    .select(
      "r.id",
      "r.name",
      db.raw("GROUP_CONCAT(rp.permission_id) as permission_ids")
    )
    .groupBy("r.id");

  const roles = rows.map((r: any) => ({
    ...r,
    permission_ids: r.permission_ids
      ? r.permission_ids.split(",").map(Number)
      : [],
  }));

  return roles;
  }
}
export default new RoleRepository();
