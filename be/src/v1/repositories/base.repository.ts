import { Knex } from "knex";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import db from "../databases/init.mysql-v2";

export default class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findAll(): Promise<T[]> {
    return await db(this.tableName).select("*");
  }

  async findAllPagination(
    paginationDto: PaginationDto,
    customFilter?: (query: Knex.QueryBuilder) => void,
  ): Promise<ResponsePaginationDto<T>> {
    const { page, size } = paginationDto;
    const offset = (page - 1) * size;
    let query = db(this.tableName).select("*").whereNull("deleted_at");

    if (customFilter) customFilter(query);

    const totalQuery = query
      .clone()
      .clearSelect()
      .count<{ count: number }[]>("id as count");
    const [{ count }] = await totalQuery;

    const items = await query.limit(size).offset(offset).orderBy("id", "desc");

    return {
      items,
      size,
      page,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }

  async findById(id: number | string): Promise<T | undefined> {
    return await db(this.tableName)
      .where({ id })
      .whereNull("deleted_at")
      .first();
  }

  async create(data: Partial<T>): Promise<T> {
    const [createdId] = await db(this.tableName).insert(data);
    const newData = await db(this.tableName).where("id", createdId).first();
    return newData;
  }

  async createMany(data: Partial<T>[]): Promise<number[]> {
    const createdIds = await db(this.tableName).insert(data);
    return createdIds;
  }

  async update(id: number | string, data: Partial<T>): Promise<T | undefined> {
    await db(this.tableName).where({ id }).update(data);
    const updated = await db(this.tableName).where({ id }).first();
    return updated;
  }

  async delete(id: number | string): Promise<number> {
    return await db(this.tableName).where({ id }).del();
  }

  async softDelete(id: number | string): Promise<number> {
    const now = new Date();
    return await db(this.tableName).where({ id }).update({ deleted_at: now });
  }

  async findByCondition(condition: Partial<T>): Promise<T[]> {
    return await db(this.tableName).where(condition).whereNull("deleted_at");
  }

  async findOneByCondition(condition: Partial<T>): Promise<T> {
    return await db(this.tableName)
      .where(condition)
      .whereNull("deleted_at")
      .first();
  }
}
