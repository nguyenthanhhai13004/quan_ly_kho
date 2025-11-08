import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import CategoryService from "../services/category.service";

class CategoryController {
  getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const size = req.query.size ? Number(req.query.size) : 10;
    const safePage = Number.isNaN(page) ? 1 : page;
    const safeSize = Number.isNaN(size) ? 10 : size;
    return new OK({
      message: "danh sách danh mục",
      data: await CategoryService.getAllCategories({
        page:safePage,
        size: safeSize,
      }),
    }).send(res);
  };

  createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "tạo danh mục thành công",
      data: await CategoryService.addNewCategory(req.body),
    }).send(res);
  };

  updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "cập nhật danh mục thành công",
      data: await CategoryService.updateCategory(Number(req.params.id),req.body),
    }).send(res);
  };

  deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "xóa danh mục thành công",
      data: await CategoryService.deleteCategory(Number(req.params.id)),
    }).send(res);
  };
}
export default new CategoryController();
