import {WAREHOUSE_USER_TABLE_NAME } from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import { WarehouseUser } from "../models/warehouse-user.model";

class WarehouseUserRepository extends BaseRepository<WarehouseUser> {
  constructor() {
    super(WAREHOUSE_USER_TABLE_NAME);
  }
}
export default new WarehouseUserRepository();