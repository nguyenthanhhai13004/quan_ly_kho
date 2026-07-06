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
  // Tạo query gốc, join các bảng liên quan để lấy đủ thông tin hiển thị cho yêu cầu.
  private baseRequestQuery() {
    return db(`${ADVISOR_REQUESTS_TABLE_NAME} as r`)
      .leftJoin(`${USER_TABLE_NAME} as adv`, "r.advisor_id", "adv.id")
      .leftJoin(`${CLASSES_TABLE_NAME} as c`, "r.class_id", "c.id")
      .leftJoin(`${STUDENTS_TABLE_NAME} as s`, "r.student_id", "s.id")
      .leftJoin(`${ASSET_TABLE_NAME} as a`, "r.asset_id", "a.id")
      .leftJoin(`${USER_TABLE_NAME} as proc`, "r.processed_by_user_id", "proc.id");
  }

  // Chọn các cột cần trả về cho frontend sau khi đã join đủ bảng.
  private selectRequestFields(query: any) {
    return query.select(
        "r.*",
        "adv.fullname as advisor_name",
        "c.name as class_name",
        "s.fullname as student_name",
        "s.student_code as student_code",
        "a.name as asset_name",
        "a.code as asset_code",
        "proc.fullname as processed_by_user_name"
      );
  }

  // Áp dụng các điều kiện lọc chung: từ khóa, trạng thái, loại, lớp và khoảng ngày.
  private applyRequestFilters(query: any, params: PaginationRequestsDto) {
    const { keyword = "", status, type, class_id, start_date, end_date } = params;

    if (keyword) {
      // Từ khóa có thể khớp tên/mã học viên hoặc tên/mã tài sản.
      query = query.where(function (this: any) {
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
        // Nếu chỉ truyền ngày yyyy-mm-dd thì lấy đến cuối ngày đó.
        adjustedEnd = `${end_date} 23:59:59`;
      }
      query = query.where("r.created_at", "<=", adjustedEnd);
    }

    return query;
  }

  // Gom nhiều dòng tài sản thành một nhóm yêu cầu theo các cột định danh truyền vào.
  private buildGroupedQuery(query: any, groupColumns: string[]) {
    return query
      .clone()
      .clearSelect()
      .select(groupColumns)
      // Lưu lại id của các dòng tài sản trong nhóm để lát nữa lấy đầy đủ chi tiết.
      .select(db.raw("GROUP_CONCAT(r.id ORDER BY r.id DESC) as request_ids"))
      .groupBy(...groupColumns);
  }

  // Phân trang theo nhóm yêu cầu, không phân trang theo từng tài sản riêng lẻ.
  private async paginateGroupedRequests(
    query: any,
    groupColumns: string[],
    page: number,
    size: number,
  ): Promise<ResponsePaginationDto<any>> {
    const offset = (page - 1) * size;
    // Đếm số nhóm yêu cầu để total/totalPages đúng với số dòng hiển thị trên bảng.
    const totalResult = await db
      .from(this.buildGroupedQuery(query, groupColumns).as("request_groups"))
      .count<{ count: number | string }>({ count: "*" })
      .first();
    const total = Number(totalResult?.count || 0);
    const totalPages = Math.ceil(total / size);

    if (total === 0) {
      return { items: [], size, page, total, totalPages };
    }

    // Lấy các nhóm thuộc trang hiện tại, mỗi nhóm có thể chứa nhiều tài sản.
    const groups = await this.buildGroupedQuery(query, groupColumns)
      .orderByRaw("MAX(r.id) DESC")
      .limit(size)
      .offset(offset);
    // Tách chuỗi id trong GROUP_CONCAT thành mảng số để lấy lại bản ghi chi tiết.
    const requestIds = groups.flatMap((group: any) =>
      String(group.request_ids || "")
        .split(",")
        .map(Number)
        .filter(Boolean),
    );

    if (requestIds.length === 0) {
      return { items: [], size, page, total, totalPages };
    }

    // Trả về các dòng tài sản đầy đủ; frontend sẽ gom lại theo cùng key để hiển thị một đơn.
    const items = await this.selectRequestFields(query.clone())
      .whereIn("r.id", requestIds)
      .orderBy("r.id", "desc");

    return {
      items,
      size,
      page,
      total,
      totalPages,
    };
  }

  // Lấy tất cả yêu cầu cho cán bộ kho/admin; cán bộ kho chỉ thấy yêu cầu thuộc kho của mình.
  async getAll(user: any, params: PaginationRequestsDto): Promise<ResponsePaginationDto<any>> {
    const { size = 20, page = 1 } = params;
    let query = this.applyRequestFilters(this.baseRequestQuery(), params);

    if (user.role_id !== 1) {
      // Với cán bộ kho, lấy danh sách kho mà user được gán quyền quản lý.
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

    // Trang duyệt của kho cần phân biệt thêm advisor_id để không gộp nhầm 2 chỉ huy.
    return this.paginateGroupedRequests(
      query,
      ["r.created_at", "r.advisor_id", "r.type", "r.note"],
      page,
      size,
    );
  }

  // Lấy lịch sử yêu cầu của riêng một Chỉ huy.
  async getByAdvisor(advisorId: number, params: PaginationRequestsDto): Promise<ResponsePaginationDto<any>> {
    const { size = 20, page = 1 } = params;
    const query = this.applyRequestFilters(
      this.baseRequestQuery().where("r.advisor_id", advisorId),
      { ...params, class_id: undefined },
    );

    // Với một Chỉ huy cụ thể, key nhóm chỉ cần thời gian tạo + loại + ghi chú.
    return this.paginateGroupedRequests(
      query,
      ["r.created_at", "r.type", "r.note"],
      page,
      size,
    );
  }

  // Tìm một dòng yêu cầu theo id, thường dùng trước khi duyệt/từ chối/xử lý.
  async findById(id: number): Promise<AdvisorRequest | null> {
    const request = await db<AdvisorRequest>(ADVISOR_REQUESTS_TABLE_NAME).where("id", id).first();
    return request || null;
  }

  // Tạo một dòng yêu cầu đơn lẻ.
  async store(data: Partial<AdvisorRequest>): Promise<AdvisorRequest | null> {
    const [id] = await db(ADVISOR_REQUESTS_TABLE_NAME).insert(data);
    return await this.findById(id);
  }

  // Tạo nhiều dòng yêu cầu cùng lúc, mỗi tài sản trong một đơn là một dòng.
  async storeMany(data: Partial<AdvisorRequest>[]): Promise<boolean> {
    await db(ADVISOR_REQUESTS_TABLE_NAME).insert(data);
    return true;
  }

  // Cập nhật trạng thái/phản hồi/người xử lý cho một dòng yêu cầu.
  async update(id: number, data: Partial<AdvisorRequest>): Promise<AdvisorRequest | null> {
    await db(ADVISOR_REQUESTS_TABLE_NAME)
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      });
    return await this.findById(id);
  }

  // Xóa một dòng yêu cầu theo id.
  async delete(id: number): Promise<boolean> {
    const deleted = await db(ADVISOR_REQUESTS_TABLE_NAME).where({ id }).del();
    return deleted > 0;
  }
}

export default new AdvisorRequestRepository();
