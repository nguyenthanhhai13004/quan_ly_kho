import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../cores/success.response";
import StudentService from "../services/student.service";
import { ForbiddenError } from "../cores/error.response";
import db from "../databases/init.mysql-v2";

class StudentController {
  static async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await StudentService.createStudent(req.body, req);
      new CREATED({
        message: "Tạo mới học viên thành công",
        data: created,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // If Commander role, check if student belongs to their class
      if (req.user.role_id === 3) {
        const student = await StudentService.getById(Number(req.params.id));
        const dbUser = await db("users").where({ id: req.user.id }).first("class_id");
        if (student.class_id !== dbUser?.class_id) {
          throw new ForbiddenError("Không có quyền cập nhật thông tin học viên này");
        }
        // Prevent Commander from altering student class_id
        req.body.class_id = student.class_id;
      }

      const updated = await StudentService.updateStudent(Number(req.params.id), req.body, req);
      new OK({
        message: "Cập nhật học viên thành công",
        data: updated,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // If Commander role, check if student belongs to their class
      if (req.user.role_id === 3) {
        const student = await StudentService.getById(Number(req.params.id));
        const dbUser = await db("users").where({ id: req.user.id }).first("class_id");
        if (student.class_id !== dbUser?.class_id) {
          throw new ForbiddenError("Không có quyền đặt lại mật khẩu cho học viên này");
        }
      }

      await StudentService.resetPassword(Number(req.params.id), req);
      new OK({
        message: "Đặt lại mật khẩu thành công",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, size, keyword, class_id, active } = req.query;

      let targetClassId = class_id ? Number(class_id) : undefined;
      // If Commander role, restrict to their class
      if (req.user.role_id === 3) {
        const dbUser = await db("users").where({ id: req.user.id }).first("class_id");
        targetClassId = dbUser?.class_id || -1;
      }

      const data = await StudentService.getAll({
        page: Number(page) || 1,
        size: Number(size) || 20,
        keyword: keyword as string,
        class_id: targetClassId,
        active: active !== undefined ? Number(active) : undefined,
      });
      new OK({
        message: "Lấy danh sách học viên thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await StudentService.getById(Number(req.params.id));
      // If Commander role, check if student belongs to their class
      if (req.user.role_id === 3 && data) {
        const dbUser = await db("users").where({ id: req.user.id }).first("class_id");
        if (data.class_id !== dbUser?.class_id) {
          throw new ForbiddenError("Không có quyền truy cập thông tin học viên này");
        }
      }
      new OK({
        message: "Lấy thông tin học viên thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await StudentService.delete(Number(req.params.id), req);
      new OK({
        message: "Xóa học viên thành công",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

export default StudentController;
