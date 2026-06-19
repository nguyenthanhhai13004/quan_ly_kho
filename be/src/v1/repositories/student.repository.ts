import db from "../databases/init.mysql-v2";
import { STUDENTS_TABLE_NAME, CLASSES_TABLE_NAME } from "../cores/constants/table-name.constant";
import { Student } from "../models/student.model";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";

export interface PaginationStudentsDto extends PaginationDto {
  keyword?: string;
  class_id?: number | number[];
  active?: number;
}

class StudentRepository {
  async getAll({
    size = 20,
    page = 1,
    keyword = "",
    class_id,
    active,
  }: PaginationStudentsDto): Promise<ResponsePaginationDto<any>> {
    const offset = (page - 1) * size;
    let query = db(`${STUDENTS_TABLE_NAME} as s`)
      .select(
        "s.id",
        "s.class_id",
        "s.student_code",
        "s.fullname",
        "s.email",
        "s.phone_number",
        "s.is_active",
        "s.created_at",
        "s.updated_at",
        "c.name as class_name"
      )
      .leftJoin(`${CLASSES_TABLE_NAME} as c`, "s.class_id", "c.id");

    if (keyword) {
      query = query.where(function () {
        this.where("s.fullname", "like", `%${keyword}%`)
            .orWhere("s.student_code", "like", `%${keyword}%`)
            .orWhere("s.email", "like", `%${keyword}%`);
      });
    }

    if (class_id) {
      if (Array.isArray(class_id)) {
        query = query.whereIn("s.class_id", class_id);
      } else {
        query = query.where("s.class_id", class_id);
      }
    }

    if (active !== undefined && active !== null) {
        query = query.where("s.is_active", active);
    }

    const totalQuery = query
      .clone()
      .clearSelect()
      .count<{ count: number }[]>("s.id as count");
    const [{ count }] = await totalQuery;

    const items = await query.limit(size).offset(offset).orderBy("s.id", "desc");
    
    return {
      items,
      size,
      page,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }

  async findById(id: number): Promise<Student | null> {
    const student = await db<Student>(STUDENTS_TABLE_NAME).where("id", id).first();
    return student || null;
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await db<Student>(STUDENTS_TABLE_NAME).where("email", email).first();
    return student || null;
  }

  async findByCode(student_code: string): Promise<Student | null> {
    const student = await db<Student>(STUDENTS_TABLE_NAME).where("student_code", student_code).first();
    return student || null;
  }

  async store(data: Partial<Student>): Promise<Student | null> {
    const [id] = await db(STUDENTS_TABLE_NAME).insert(data);
    return await this.findById(id);
  }

  async update(id: number, data: Partial<Student>): Promise<Student | null> {
    await db(STUDENTS_TABLE_NAME)
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db(STUDENTS_TABLE_NAME).where({ id }).del();
    return deleted > 0;
  }
}

export default new StudentRepository();
