import db from "../databases/init.mysql-v2";
import { CLASSES_TABLE_NAME, MAJORS_TABLE_NAME } from "../cores/constants/table-name.constant";
import { Class } from "../models/class.model";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";

export interface PaginationClassesDto extends PaginationDto {
  keyword?: string;
  major_id?: number;
}

class ClassRepository {
  async getAll({
    size = 20,
    page = 1,
    keyword = "",
    major_id,
  }: PaginationClassesDto): Promise<ResponsePaginationDto<any>> {
    const offset = (page - 1) * size;
    let query = db(`${CLASSES_TABLE_NAME} as c`)
      .select(
        "c.*",
        "m.name as major_name",
        db.raw("(SELECT COUNT(*) FROM students WHERE class_id = c.id) as student_count")
      )
      .leftJoin(`${MAJORS_TABLE_NAME} as m`, "c.major_id", "m.id");

    if (keyword) {
      query = query.where(function () {
        this.where("c.name", "like", `%${keyword}%`).orWhere(
          "c.code",
          "like",
          `%${keyword}%`
        );
      });
    }

    if (major_id) {
        query = query.where("c.major_id", major_id);
    }

    const totalQuery = query
      .clone()
      .clearSelect()
      .count<{ count: number }[]>("c.id as count");
    const [{ count }] = await totalQuery;

    const items = await query.limit(size).offset(offset).orderBy("c.id", "desc");
    
    return {
      items,
      size,
      page,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }

  async getAllList(major_id?: number): Promise<Class[]> {
    let query = db<Class>(CLASSES_TABLE_NAME).select("*");
    if (major_id) {
        query = query.where("major_id", major_id);
    }
    return await query.orderBy("name", "asc");
  }

  async findById(id: number): Promise<Class | null> {
    const _class = await db<Class>(CLASSES_TABLE_NAME).where("id", id).first();
    return _class || null;
  }

  async findByCode(code: string): Promise<Class | null> {
    const _class = await db<Class>(CLASSES_TABLE_NAME).where("code", code).first();
    return _class || null;
  }

  async store(data: Partial<Class>): Promise<Class | null> {
    const [id] = await db(CLASSES_TABLE_NAME).insert(data);
    return await this.findById(id);
  }

  async update(id: number, data: Partial<Class>): Promise<Class | null> {
    await db(CLASSES_TABLE_NAME)
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db(CLASSES_TABLE_NAME).where({ id }).del();
    return deleted > 0;
  }
}

export default new ClassRepository();
