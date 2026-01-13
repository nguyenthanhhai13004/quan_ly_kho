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

  async findAllWithUsers(paginationDto: PaginationDto & { keyword?: string }) {
    const { page, size, keyword } = paginationDto;
    const offset = (page - 1) * size;

    let query = db(this.tableName)
      .select(
        `${this.tableName}.*`,
        "address.address_detail",
        "address.latitude",
        "address.longitude",
        db.raw(`
        CONCAT(
          '[',
          GROUP_CONCAT(
            JSON_OBJECT(
              'id', users.id,
              'fullname', users.fullname,
              'email', users.email
            )
          ),
          ']'
        ) as managers
      `),
      )
      .leftJoin(
        "warehouse_user",
        "warehouse_user.warehouse_id",
        `${this.tableName}.id`,
      )
      .leftJoin("users", "users.id", "warehouse_user.user_id")
      .leftJoin("address", "address.id", `${this.tableName}.address_id`)
      .whereNull(`${this.tableName}.deleted_at`)
      .groupBy(`${this.tableName}.id`);

    if (keyword) {
      query = query.andWhere((qb) => {
        qb.where(`${this.tableName}.name`, "like", `%${keyword}%`).orWhere(
          `${this.tableName}.address`,
          "like",
          `%${keyword}%`,
        );
      });
    }

    let totalQuery = db(this.tableName).whereNull("deleted_at");

    if (keyword) {
      totalQuery = totalQuery.andWhere((qb) => {
        qb.where("name", "like", `%${keyword}%`).orWhere(
          "address",
          "like",
          `%${keyword}%`,
        );
      });
    }

    const totalResult =
      await totalQuery.count<{ count: number }[]>("id as count");

    const count = Number(totalResult?.[0]?.count || 0);

    const rows = await query
      .limit(size)
      .offset(offset)
      .orderBy(`${this.tableName}.id`, "desc");

    const items = rows.map((row) => ({
      ...row,
      managers: row.managers ? JSON.parse(row.managers) : [],
    }));

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
