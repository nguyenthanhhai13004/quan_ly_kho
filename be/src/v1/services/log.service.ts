import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import { InternalServerError } from "../cores/error.response";
import db from "../databases/init.mysql-v2";
import LogFilterPaginationDto from "../dtos/kqn-logs/log-filter-pagination";

interface LogInput {
  username: string;
  action_code: string;
  controller_code?: string;
  ip?: string;
  url?: string;
  data?: any;
  edit_changes?: Array<{
    field: string;
    old_value: any;
    new_value: any;
  }>;
}

export class KQNLogService {
  static async createLog(input: LogInput) {
    const action = await db("log_actions")
      .where("code", input.action_code)
      .first();
    if (!action) throw new InternalServerError();

    let controller_id: number | null = null;
    if (input.controller_code) {
      const controller = await db("log_controllers")
        .where("code", input.controller_code)
        .first();
      if (!controller) throw new InternalServerError();
      controller_id = controller.id;
    }

    const [id] = await db("kqn_logs")
      .insert({
        username: input.username,
        action_id: action.id,
        controller_id: controller_id,
        ip: input.ip || null,
        url: input.url || null,
        data: input.data || null,
        edit_changes: input.edit_changes
          ? JSON.stringify(input.edit_changes)
          : null,
      })
      .returning("id");

    return id;
  }

  static async getLogs(
    filter: LogFilterPaginationDto,
  ): Promise<ResponsePaginationDto<any>> {
    const page = filter.page ? Number(filter.page) : 1;
    const size = filter.size ? Number(filter.size) : 10;
    const offset = (page - 1) * size;

    const baseQuery = db("kqn_logs")
      .leftJoin("log_actions", "log_actions.id", "kqn_logs.action_id")
      .leftJoin(
        "log_controllers",
        "log_controllers.id",
        "kqn_logs.controller_id",
      )
      .where(function () {
        if (filter.username) this.where("kqn_logs.username", filter.username);
        if (filter.action_id)
          this.where("kqn_logs.action_id", filter.action_id);
        if (filter.controller_id)
          this.where("kqn_logs.controller_id", filter.controller_id);
        if (filter.startDate)
          this.where("kqn_logs.created_at", ">=", filter.startDate);
        if (filter.endDate)
          this.where("kqn_logs.created_at", "<=", filter.endDate);
      });

    const totalQuery = baseQuery
      .clone()
      .count<{ count: number }[]>("kqn_logs.id as count");
    const [{ count }] = await totalQuery;

    const items = await baseQuery
      .clone()
      .select(
        "kqn_logs.*",
        "log_actions.name as action_name",
        "log_controllers.name as controller_name",
      )
      .orderBy("kqn_logs.created_at", "desc")
      .limit(size)
      .offset(offset);

    return {
      items,
      page,
      size,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / size),
    };
  }

  static async getLogById(id: number) {
    return db("logs").where("id", id).first();
  }
}

export default KQNLogService;
