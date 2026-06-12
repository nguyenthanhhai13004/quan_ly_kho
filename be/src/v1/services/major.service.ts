import { Request } from "express";
import majorRepository, { PaginationMajorsDto } from "../repositories/major.repository";
import { BadRequestError, NotFoundError, InternalServerError } from "../cores/error.response";
import { Major } from "../models/major.model";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import KQNLogService from "./log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";

class MajorService {
  static async createMajor(data: Partial<Major>, req: Request): Promise<Major> {
    const existing = await majorRepository.findByCode(data.code!);
    if (existing) {
      throw new BadRequestError("Mã hệ đã tồn tại");
    }

    const created = await majorRepository.store(data);
    if (!created) {
      throw new InternalServerError("Lỗi khi tạo mới hệ");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.MAJOR,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });

    return created;
  }

  static async updateMajor(id: number, data: Partial<Major>, req: Request): Promise<Major> {
    const major = await majorRepository.findById(id);
    if (!major) {
      throw new NotFoundError("Hệ không tồn tại");
    }

    if (data.code && data.code !== major.code) {
      const existing = await majorRepository.findByCode(data.code);
      if (existing) {
        throw new BadRequestError("Mã hệ đã tồn tại");
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code: _code, ...updateData } = data;
    const updated = await majorRepository.update(id, updateData);
    if (!updated) {
      throw new InternalServerError("Lỗi khi cập nhật hệ");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: "MAJOR" as LogController,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });

    return updated;
  }

  static async getAll(paginationDto: PaginationMajorsDto): Promise<ResponsePaginationDto<Major>> {
    return await majorRepository.getAll(paginationDto);
  }

  static async getAllList(): Promise<Major[]> {
    return await majorRepository.getAllList();
  }

  static async getById(id: number): Promise<Major> {
    const major = await majorRepository.findById(id);
    if (!major) {
      throw new NotFoundError("Hệ không tồn tại");
    }
    return major;
  }

  static async delete(id: number, req: Request): Promise<boolean> {
    const major = await majorRepository.findById(id);
    if (!major) {
      throw new NotFoundError("Hệ không tồn tại");
    }

    const deleted = await majorRepository.delete(id);
    if (!deleted) {
      throw new InternalServerError("Lỗi khi xóa hệ");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.DELETE,
      controller_code: "MAJOR" as LogController,
      username: req.user.username,
      data: { id },
      ip,
      url,
    });

    return true;
  }
}

export default MajorService;
