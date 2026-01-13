import {WAREHOUSE_USER_TABLE_NAME } from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import { WarehouseUser } from "../models/warehouse-user.model";
import db from "../databases/init.mysql-v2";

class WarehouseUserRepository extends BaseRepository<WarehouseUser> {
  constructor() {
    super(WAREHOUSE_USER_TABLE_NAME);
  }

  async deleteAllByUserId(userId: number): Promise<number> {
    return await db(this.tableName).where("user_id", userId).del();
  }
}
export default new WarehouseUserRepository();