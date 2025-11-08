import {
  WAREHOUSE_TABLE_NAME,
  WAREHOUSE_USER_TABLE_NAME,
} from "../cores/constants/table-name.constant";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import db from "../databases/init.mysql-v2";
import { Warehouse } from "../models/warehouse.model";
import BaseRepository from "./base.repository";

class WarehouseRepository extends BaseRepository<Warehouse> {
  constructor() {
    super(WAREHOUSE_TABLE_NAME);
  }

  async findAllOwn(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<ResponsePaginationDto<Warehouse>> {
    const { page, size } = paginationDto;
    const offset = (page - 1) * size;
    let query = db(this.tableName)
      .select(`${this.tableName}.*`)
      .innerJoin(
        WAREHOUSE_USER_TABLE_NAME,
        `${WAREHOUSE_USER_TABLE_NAME}.warehouse_id`,
        `${this.tableName}.id`,
      )
      .where(`${WAREHOUSE_USER_TABLE_NAME}.user_id`, userId)
      .whereNull(`${this.tableName}.deleted_at`);

    const totalQuery = query
      .clone()
      .clearSelect()
      .count<{ count: number }[]>("* as count");
    const [{ count }] = await totalQuery;

    const items = await query
      .limit(size)
      .offset(offset)
      .orderBy(`${this.tableName}.id`, "desc");

    return {
      items,
      size,
      page,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }
}
export default new WarehouseRepository();
