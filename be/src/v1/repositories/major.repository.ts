import db from "../databases/init.mysql-v2";
import { MAJORS_TABLE_NAME } from "../cores/constants/table-name.constant";
import { Major } from "../models/major.model";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";

export interface PaginationMajorsDto extends PaginationDto {
  keyword?: string;
}

class MajorRepository {
  async getAll({
    size = 20,
    page = 1,
    keyword = "",
  }: PaginationMajorsDto): Promise<ResponsePaginationDto<Major>> {
    const offset = (page - 1) * size;
    let query = db<Major>(MAJORS_TABLE_NAME).select("*");

    if (keyword) {
      query = query.where(function () {
        this.where("name", "like", `%${keyword}%`).orWhere(
          "code",
          "like",
          `%${keyword}%`
        );
      });
    }

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

  async getAllList(): Promise<Major[]> {
    return await db<Major>(MAJORS_TABLE_NAME).select("*").orderBy("name", "asc");
  }

  async findById(id: number): Promise<Major | null> {
    const major = await db<Major>(MAJORS_TABLE_NAME).where("id", id).first();
    return major || null;
  }

  async findByCode(code: string): Promise<Major | null> {
    const major = await db<Major>(MAJORS_TABLE_NAME).where("code", code).first();
    return major || null;
  }

  async store(data: Partial<Major>): Promise<Major | null> {
    const [id] = await db(MAJORS_TABLE_NAME).insert(data);
    return await this.findById(id);
  }

  async update(id: number, data: Partial<Major>): Promise<Major | null> {
    await db(MAJORS_TABLE_NAME)
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db(MAJORS_TABLE_NAME).where({ id }).del();
    return deleted > 0;
  }
}

export default new MajorRepository();
