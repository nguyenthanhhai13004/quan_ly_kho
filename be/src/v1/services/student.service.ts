import { Request } from "express";
import studentRepository, { PaginationStudentsDto } from "../repositories/student.repository";
import { BadRequestError, NotFoundError, InternalServerError, ForbiddenError } from "../cores/error.response";
import { Student } from "../models/student.model";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import KQNLogService from "./log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";
import { hashPassword } from "../auths/utils";
import { generateRandomPassword } from "../utils/generate-random-password";
import db from "../databases/init.mysql-v2";

class StudentService {
  private static async checkCommanderClassAccess(userId: number, classId: number, errorMessage: string) {
    const dbUser = await db("users").where({ id: userId }).first("major_id");
    if (!dbUser?.major_id) {
      throw new ForbiddenError(errorMessage);
    }
    const classBelongsToMajor = await db("classes")
      .where({ id: classId, major_id: dbUser.major_id })
      .first();
    if (!classBelongsToMajor) {
      throw new ForbiddenError(errorMessage);
    }
  }

  static async createStudent(data: Partial<Student>, req: Request): Promise<Student> {
    if (req.user.role_id === 3) {
      if (!data.class_id) {
        throw new ForbiddenError("Vui lòng chọn lớp học");
      }
      await this.checkCommanderClassAccess(req.user.id, data.class_id, "Không có quyền tạo học viên cho lớp này");
    }

    if (data.class_id) {
      const classExists = await db("classes").where({ id: data.class_id }).first();
      if (!classExists) {
        throw new BadRequestError("Lớp học được chọn không tồn tại");
      }
    }

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

    if (req.user.role_id === 3) {
      await this.checkCommanderClassAccess(req.user.id, student.class_id, "Không có quyền cập nhật thông tin học viên này");
      // Prevent Commander from altering student class_id
      data.class_id = student.class_id;
    }

    if (data.class_id) {
      const classExists = await db("classes").where({ id: data.class_id }).first();
      if (!classExists) {
        throw new BadRequestError("Lớp học được chọn không tồn tại");
      }
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

  static async getAll(paginationDto: PaginationStudentsDto, req?: Request): Promise<ResponsePaginationDto<any>> {
    let targetClassId = paginationDto.class_id;

    if (req && req.user && req.user.role_id === 3) {
      const dbUser = await db("users").where({ id: req.user.id }).first("major_id");
      if (dbUser?.major_id) {
        const class_id = paginationDto.class_id;
        if (class_id) {
          const singleClassId = Array.isArray(class_id) ? class_id[0] : class_id;
          const classBelongs = await db("classes").where({ id: Number(singleClassId), major_id: dbUser.major_id }).first();
          if (classBelongs) {
            targetClassId = Number(singleClassId);
          } else {
            targetClassId = -1;
          }
        } else {
          const classesInMajor = await db("classes").where({ major_id: dbUser.major_id }).select("id");
          const classIds = classesInMajor.map(c => c.id);
          targetClassId = classIds.length > 0 ? classIds : -1;
        }
      } else {
        targetClassId = -1;
      }
    }

    return await studentRepository.getAll({
      ...paginationDto,
      class_id: targetClassId,
    });
  }

  static async getById(id: number, req?: Request): Promise<Student> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }

    if (req && req.user && req.user.role_id === 3) {
      await this.checkCommanderClassAccess(req.user.id, student.class_id, "Không có quyền truy cập thông tin học viên này");
    }

    return student;
  }

  static async resetPassword(id: number, req: Request): Promise<boolean> {
    const student = await studentRepository.findById(id);
    if (!student) {
      throw new NotFoundError("Học viên không tồn tại");
    }

    if (req.user.role_id === 3) {
      await this.checkCommanderClassAccess(req.user.id, student.class_id, "Không có quyền đặt lại mật khẩu cho học viên này");
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

    if (req.user.role_id === 3) {
      await this.checkCommanderClassAccess(req.user.id, student.class_id, "Không có quyền xóa học viên này");
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
