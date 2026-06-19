import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../cores/success.response";
import StudentService from "../services/student.service";

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

      const data = await StudentService.getAll({
        page: Number(page) || 1,
        size: Number(size) || 20,
        keyword: keyword as string,
        class_id: class_id ? Number(class_id) : undefined,
        active: active !== undefined ? Number(active) : undefined,
      }, req);
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
      const data = await StudentService.getById(Number(req.params.id), req);
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
