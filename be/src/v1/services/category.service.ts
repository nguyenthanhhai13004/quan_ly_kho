import { Request } from "express";
import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../cores/error.response";
import db from "../databases/init.mysql-v2";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";
import { Category } from "../models/category.model";
import assetRepository from "../repositories/asset.repository";
import categoryRepository from "../repositories/category.repository";
import { getRequestInfo } from "../utils/request-info";
import KQNLogService from "./log.service";
import { getDiffChangesArray } from "../utils/get-diff-changes";

export type CategoryStat = {
  id: string; // tên danh mục
  label: string; // nhãn hiển thị
  value: number; // tổng số lượng
};

class CategoryService {
  static async getAllCategories(
    paginationDto: PaginationDto & {
      keyword?: string;
    },
  ): Promise<ResponsePaginationDto<Category>> {
    return await categoryRepository.findAllPagination(paginationDto, (q) => {
      const { keyword } = paginationDto;
      if (keyword && keyword.trim() !== "") {
        q.where((builder) =>
          builder
            .whereILike("name", `%${keyword}%`)
            .orWhereILike("description", `%${keyword}%`),
        );
      }
    });
  }

  static async getDetail(category_id: number): Promise<Category> {
    const categoryFound = await categoryRepository.findById(category_id);
    if (!categoryFound) throw new NotFoundError("danh mục không tồn tại");
    return categoryFound;
  }

  static async addNewCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const categoryFound = await categoryRepository.findOneByCondition({
      name: createCategoryDto.code,
    });
    if (categoryFound) {
      throw new BadRequestError("danh mục này đã tồn tại");
    }
    const categoryStore = await categoryRepository.create(createCategoryDto);
    return categoryStore;
  }

  static async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
    req: Request,
  ): Promise<Category> {
    const categoryFound = await categoryRepository.findById(categoryId);
    if (!categoryFound) {
      throw new NotFoundError("không tìm thấy danh mục");
    }

    // find name
    const nameIsExit = await categoryRepository.findOneByCondition({
      name: updateCategoryDto.name,
    });
    if (nameIsExit && updateCategoryDto.name !== categoryFound.name) {
      throw new BadRequestError("đã tồn tại tên danh mục này");
    }

    const updated = await categoryRepository.update(
      categoryId,
      updateCategoryDto,
    );

    if (!updated) {
      throw new InternalServerError();
    }

    const { ip, url } = getRequestInfo(req);
    const edit_changes = getDiffChangesArray(
      {
        name: categoryFound.name,
        description: categoryFound.description,
        color: categoryFound.color,
      },
      {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
        color: updateCategoryDto.color,
      },
    );
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: LogController.CATEGORY,
      username: req.user.username,
      data: req.body,
      ip,
      url,
      edit_changes,
    });
    return updated;
  }

  static async deleteCategory(categoryId: number): Promise<number> {
    const categoryFound = await categoryRepository.findById(categoryId);
    if (!categoryFound) throw new NotFoundError("danh mục không tồn tại");

    const countAssets = await db("warehouse_asset as wa")
      .join("assets as a", "wa.asset_id", "a.id")
      .where("a.category_id", categoryId)
      .count<{ total: string }>("wa.id as total")
      .first();

    if (Number(countAssets?.total || 0) > 0) {
      throw new BadRequestError(
        "Không thể xóa category này vì còn tài sản thuộc category",
      );
    }
    const deleted = await categoryRepository.softDelete(categoryId);

    return deleted;
  }

  static async getStatsByCategory(
    warehouse_id: number,
  ): Promise<CategoryStat[]> {
    const rows = await db("assets as a")
      .select("c.name as category", db.raw("SUM(wa.quantity) as total"))
      .leftJoin("categories as c", "a.category_id", "c.id")
      .leftJoin("warehouse_asset as wa", "wa.asset_id", "a.id")
      .where("wa.warehouse_id", warehouse_id)
      .groupBy("c.name");

    const result: CategoryStat[] = rows.map((row: any) => ({
      id: row.category,
      label: row.category,
      value: Number(row.total) || 0,
    }));
    return result;
  }
}
export default CategoryService;
