import { Request } from "express";
import studentRepository, { PaginationStudentsDto } from "../repositories/student.repository";
import { BadRequestError, NotFoundError, InternalServerError } from "../cores/error.response";
import { Student } from "../models/student.model";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import KQNLogService from "./log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";
import { hashPassword } from "../auths/utils";
import { generateRandomPassword } from "../utils/generate-random-password";

class StudentService {
  static async createStudent(data: Partial<Student>, req: Request): Promise<Student> {
    const existingCode = await studentRepository.findByCode(data.student_code!);
    if (existingCode) {
      throw new BadRequestError("Mã học viên đã tồn tại");
    }

    const existingEmail = await studentRepository.findByEmail(data.email!);
    if (existingEmail) {
      throw new BadRequestError("Email đã tồn tại");
    }

    const password = generateRandomPassword();
    const passwordHash = await hashPassword(password);
    
    data.password = passwordHash;

    const created = await studentRepository.store(data);
    if (!created) {
      throw new InternalServerError("Lỗi khi tạo mới học viên");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.STUDENT,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });

    // TODO: Send email with password (similar to UserService)

    return created;
  }

  static async updateStudent(id: number, data: Partial<Student>, req: Request): Promise<Student> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }

    if (data.student_code && data.student_code !== student.student_code) {
      const existing = await studentRepository.findByCode(data.student_code);
      if (existing) {
        throw new BadRequestError("Mã học viên đã tồn tại");
      }
    }

    if (data.email && data.email !== student.email) {
      const existing = await studentRepository.findByEmail(data.email);
      if (existing) {
        throw new BadRequestError("Email đã tồn tại");
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { student_code: _studentCode, ...updateData } = data;
    const updated = await studentRepository.update(id, updateData);
    if (!updated) {
      throw new InternalServerError("Lỗi khi cập nhật học viên");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: "STUDENT" as LogController,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });

    return updated;
  }

  static async getAll(paginationDto: PaginationStudentsDto): Promise<ResponsePaginationDto<any>> {
    return await studentRepository.getAll(paginationDto);
  }

  static async getById(id: number): Promise<Student> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }
    return student;
  }

  static async resetPassword(id: number, req: Request): Promise<boolean> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }

    const password = generateRandomPassword();
    const passwordHash = await hashPassword(password);
    
    await studentRepository.update(id, { password: passwordHash });

    // TODO: Send email
    
    return true;
  }

  static async delete(id: number, req: Request): Promise<boolean> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }

    const deleted = await studentRepository.delete(id);
    if (!deleted) {
      throw new InternalServerError("Lỗi khi xóa học viên");
    }

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.DELETE,
      controller_code: "STUDENT" as LogController,
      username: req.user.username,
      data: { id },
      ip,
      url,
    });

    return true;
  }
}

export default StudentService;
