import { Request } from "express";
import classRepository, { PaginationClassesDto } from "../repositories/class.repository";
import { BadRequestError, NotFoundError, InternalServerError } from "../cores/error.response";
import db from "../databases/init.mysql-v2";
import { Class } from "../models/class.model";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import KQNLogService from "./log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";

class ClassService {
  static async createClass(data: Partial<Class>, req: Request): Promise<Class> {
    const existing = await classRepository.findByCode(data.code!);
    if (existing) {
      throw new BadRequestError("Mã lớp đã tồn tại");
    }

    if (data.major_id) {
      const majorExists = await db("majors").where({ id: data.major_id }).first();
      if (!majorExists) {
        throw new BadRequestError("Hệ đào tạo được chọn không tồn tại");
      }
    }

    const created = await classRepository.store(data);
    if (!created) {
      throw new InternalServerError("Lỗi khi tạo mới lớp");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.CLASS,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });

    return created;
  }

  static async updateClass(id: number, data: Partial<Class>, req: Request): Promise<Class> {
    const _class = await classRepository.findById(id);
    if (!_class) {
      throw new NotFoundError("Lớp không tồn tại");
    }

    if (data.code && data.code !== _class.code) {
      const existing = await classRepository.findByCode(data.code);
      if (existing) {
        throw new BadRequestError("Mã lớp đã tồn tại");
      }
    }

    if (data.major_id) {
      const majorExists = await db("majors").where({ id: data.major_id }).first();
      if (!majorExists) {
        throw new BadRequestError("Hệ đào tạo được chọn không tồn tại");
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code: _code, ...updateData } = data;
    const updated = await classRepository.update(id, updateData);
    if (!updated) {
      throw new InternalServerError("Lỗi khi cập nhật lớp");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: "CLASS" as LogController,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });

    return updated;
  }

  static async getAll(paginationDto: PaginationClassesDto): Promise<ResponsePaginationDto<any>> {
    return await classRepository.getAll(paginationDto);
  }

  static async getAllList(major_id?: number): Promise<Class[]> {
    return await classRepository.getAllList(major_id);
  }

  static async getById(id: number): Promise<Class> {
    const _class = await classRepository.findById(id);
    if (!_class) {
      throw new NotFoundError("Lớp không tồn tại");
    }
    return _class;
  }

  static async delete(id: number, req: Request): Promise<boolean> {
    const _class = await classRepository.findById(id);
    if (!_class) {
      throw new NotFoundError("Lớp không tồn tại");
    }

    const countStudents = await db("students").where("class_id", id).count("id as total").first();
    if (Number(countStudents?.total || 0) > 0) {
      throw new BadRequestError("Không thể xóa lớp học vì vẫn còn học viên trực thuộc.");
    }

    const deleted = await classRepository.delete(id);
    if (!deleted) {
      throw new InternalServerError("Lỗi khi xóa lớp");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.DELETE,
      controller_code: "CLASS" as LogController,
      username: req.user.username,
      data: { id },
      ip,
      url,
    });

    return true;
  }
}

export default ClassService;
