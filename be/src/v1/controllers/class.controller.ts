import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../cores/success.response";
import ClassService from "../services/class.service";

class ClassController {
  static async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await ClassService.createClass(req.body, req);
      new CREATED({
        message: "Tạo mới lớp thành công",
        data: created,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateClass(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ClassService.updateClass(Number(req.params.id), req.body, req);
      new OK({
        message: "Cập nhật lớp thành công",
        data: updated,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, size, keyword, major_id } = req.query;
      let targetMajorId = major_id ? Number(major_id) : undefined;
      if (req.user.role_id === 3) {
        targetMajorId = req.user.major_id || -1;
      }
      const data = await ClassService.getAll({
        page: Number(page) || 1,
        size: Number(size) || 20,
        keyword: keyword as string,
        major_id: targetMajorId,
      });
      new OK({
        message: "Lấy danh sách lớp thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllList(req: Request, res: Response, next: NextFunction) {
    try {
      const { major_id } = req.query;
      console.log("major_id", major_id);
      let targetMajorId = major_id ? Number(major_id) : undefined;
      if (req.user.role_id === 3) {
        targetMajorId = req.user.major_id || -1;
        console.log("req.user.major_id",req.user.major_id);
      }
      const data = await ClassService.getAllList(targetMajorId);
      new OK({
        message: "Lấy danh sách tất cả lớp thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ClassService.getById(Number(req.params.id));
      new OK({
        message: "Lấy thông tin lớp thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ClassService.delete(Number(req.params.id), req);
      new OK({
        message: "Xóa lớp thành công",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

export default ClassController;
