import { Request, Response, NextFunction } from "express";
import { CREATED, OK } from "../cores/success.response";
import MajorService from "../services/major.service";

class MajorController {
  static async createMajor(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await MajorService.createMajor(req.body, req);
      new CREATED({
        message: "Tạo mới hệ thành công",
        data: created,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async updateMajor(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MajorService.updateMajor(Number(req.params.id), req.body, req);
      new OK({
        message: "Cập nhật hệ thành công",
        data: updated,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, size, keyword } = req.query;
      const data = await MajorService.getAll({
        page: Number(page) || 1,
        size: Number(size) || 20,
        keyword: keyword as string,
      });
      new OK({
        message: "Lấy danh sách hệ thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllList(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MajorService.getAllList();
      new OK({
        message: "Lấy danh sách tất cả hệ thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await MajorService.getById(Number(req.params.id));
      new OK({
        message: "Lấy thông tin hệ thành công",
        data: data,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await MajorService.delete(Number(req.params.id), req);
      new OK({
        message: "Xóa hệ thành công",
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

export default MajorController;
