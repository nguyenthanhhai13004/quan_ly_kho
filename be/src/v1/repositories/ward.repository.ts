import {WAREHOUSE_USER_TABLE_NAME } from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import db from "../databases/init.mysql-v2";
import { Ward } from "../models/ward.model";

class WardRepository extends BaseRepository<Ward> {
  constructor() {
    super("wards");
  }
}

export default new WardRepository();