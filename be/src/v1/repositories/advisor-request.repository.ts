import db from "../databases/init.mysql-v2";
import {
  ADVISOR_REQUESTS_TABLE_NAME,
  USER_TABLE_NAME,
  CLASSES_TABLE_NAME,
  STUDENTS_TABLE_NAME,
  ASSET_TABLE_NAME,
} from "../cores/constants/table-name.constant";
import { AdvisorRequest } from "../models/advisor-request.model";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";

export interface PaginationRequestsDto extends PaginationDto {
  keyword?: string;
  status?: number; // 0, 1, 2
  type?: number; // 1, 2
  class_id?: number;
  start_date?: string;
  end_date?: string;
}

class AdvisorRequestRepository {
  async getAll(user: any, params: PaginationRequestsDto): Promise<ResponsePaginationDto<any>> {
    const { size = 20, page = 1, keyword = "", status, type, class_id, start_date, end_date } = params;
    const offset = (page - 1) * size;

    let query = db(`${ADVISOR_REQUESTS_TABLE_NAME} as r`)
      .select(
        "r.*",
        "adv.fullname as advisor_name",
        "c.name as class_name",
        "s.fullname as student_name",
        "s.student_code as student_code",
        "a.name as asset_name",
        "a.code as asset_code",
        "proc.fullname as processed_by_user_name"
      )
      .leftJoin(`${USER_TABLE_NAME} as adv`, "r.advisor_id", "adv.id")
      .leftJoin(`${CLASSES_TABLE_NAME} as c`, "r.class_id", "c.id")
      .leftJoin(`${STUDENTS_TABLE_NAME} as s`, "r.student_id", "s.id")
      .leftJoin(`${ASSET_TABLE_NAME} as a`, "r.asset_id", "a.id")
      .leftJoin(`${USER_TABLE_NAME} as proc`, "r.processed_by_user_id", "proc.id");

    if (user.role_id !== 1) {
      const officerWarehouseIds = await db("warehouse_user")
        .where("user_id", user.id)
        .pluck("warehouse_id");

      if (officerWarehouseIds.length === 0) {
        return {
          items: [],
          size,
          page,
          total: 0,
          totalPages: 0,
        };
      }

      query = query.whereIn("r.warehouse_id", officerWarehouseIds);
    }

    if (keyword) {
      query = query.where(function () {
        this.where("s.fullname", "like", `%${keyword}%`)
          .orWhere("s.student_code", "like", `%${keyword}%`)
          .orWhere("a.name", "like", `%${keyword}%`)
          .orWhere("a.code", "like", `%${keyword}%`);
      });
    }

    if (status !== undefined && status !== null) {
      query = query.where("r.status", status);
    }

    if (type !== undefined && type !== null) {
      query = query.where("r.type", type);
    }

    if (class_id) {
      query = query.where("r.class_id", class_id);
    }

    if (start_date) {
      query = query.where("r.created_at", ">=", start_date);
    }

    if (end_date) {
      let adjustedEnd = end_date;
      if (end_date.length === 10) {
        adjustedEnd = `${end_date} 23:59:59`;
      }
      query = query.where("r.created_at", "<=", adjustedEnd);
    }

    const totalQuery = query
      .clone()
      .clearSelect()
      .count<{ count: number }[]>("r.id as count");
    const [{ count }] = await totalQuery;

    const items = await query.limit(size).offset(offset).orderBy("r.id", "desc");

    return {
      items,
      size,
      page,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }

  async getByAdvisor(advisorId: number, params: PaginationRequestsDto): Promise<ResponsePaginationDto<any>> {
    return this.getAll({ role_id: 1 }, { ...params, class_id: undefined }).then(async (res) => {
      // Filter by advisor ID or class ID
      // To be safe, filter the query directly in MySQL:
      const { size = 20, page = 1, keyword = "", status, type, start_date, end_date } = params;
      const offset = (page - 1) * size;

      let query = db(`${ADVISOR_REQUESTS_TABLE_NAME} as r`)
        .select(
          "r.*",
          "adv.fullname as advisor_name",
          "c.name as class_name",
          "s.fullname as student_name",
          "s.student_code as student_code",
          "a.name as asset_name",
          "a.code as asset_code",
          "proc.fullname as processed_by_user_name"
        )
        .leftJoin(`${USER_TABLE_NAME} as adv`, "r.advisor_id", "adv.id")
        .leftJoin(`${CLASSES_TABLE_NAME} as c`, "r.class_id", "c.id")
        .leftJoin(`${STUDENTS_TABLE_NAME} as s`, "r.student_id", "s.id")
        .leftJoin(`${ASSET_TABLE_NAME} as a`, "r.asset_id", "a.id")
        .leftJoin(`${USER_TABLE_NAME} as proc`, "r.processed_by_user_id", "proc.id")
        .where("r.advisor_id", advisorId);

      if (keyword) {
        query = query.where(function () {
          this.where("s.fullname", "like", `%${keyword}%`)
            .orWhere("s.student_code", "like", `%${keyword}%`)
            .orWhere("a.name", "like", `%${keyword}%`);
        });
      }

      if (status !== undefined && status !== null) {
        query = query.where("r.status", status);
      }

      if (type !== undefined && type !== null) {
        query = query.where("r.type", type);
      }

      if (start_date) {
        query = query.where("r.created_at", ">=", start_date);
      }

      if (end_date) {
        let adjustedEnd = end_date;
        if (end_date.length === 10) {
          adjustedEnd = `${end_date} 23:59:59`;
        }
        query = query.where("r.created_at", "<=", adjustedEnd);
      }

      const totalQuery = query
        .clone()
        .clearSelect()
        .count<{ count: number }[]>("r.id as count");
      const [{ count }] = await totalQuery;

      const items = await query.limit(size).offset(offset).orderBy("r.id", "desc");

      return {
        items,
        size,
        page,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / size),
      };
    });
  }

  async findById(id: number): Promise<AdvisorRequest | null> {
    const request = await db<AdvisorRequest>(ADVISOR_REQUESTS_TABLE_NAME).where("id", id).first();
    return request || null;
  }

  async store(data: Partial<AdvisorRequest>): Promise<AdvisorRequest | null> {
    const [id] = await db(ADVISOR_REQUESTS_TABLE_NAME).insert(data);
    return await this.findById(id);
  }

  async storeMany(data: Partial<AdvisorRequest>[]): Promise<boolean> {
    await db(ADVISOR_REQUESTS_TABLE_NAME).insert(data);
    return true;
  }

  async update(id: number, data: Partial<AdvisorRequest>): Promise<AdvisorRequest | null> {
    await db(ADVISOR_REQUESTS_TABLE_NAME)
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await db(ADVISOR_REQUESTS_TABLE_NAME).where({ id }).del();
    return deleted > 0;
  }
}

export default new AdvisorRequestRepository();
