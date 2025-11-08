import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../cores/error.response";
import { CreateCategoryDto } from "../dtos/category/create-category.dto";
import { UpdateCategoryDto } from "../dtos/category/update-category.dto";
import { Category } from "../models/category.model";
import assetRepository from "../repositories/asset.repository";
import categoryRepository from "../repositories/category.repository";

class CategoryService {
  static async getAllCategories(
    paginationDto: PaginationDto,
  ): Promise<ResponsePaginationDto<Category>> {
    return await categoryRepository.findAllPagination(paginationDto);
  }

  static async addNewCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const categoryFound = await categoryRepository.findOneByCondition({
      name: createCategoryDto.name,
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
  ): Promise<Category> {
    const categoryFound = await categoryRepository.findById(categoryId);
    if (!categoryFound) {
      throw new NotFoundError("không tìm thấy danh mục");
    }

    // find name
    const nameIsExit = await categoryRepository.findOneByCondition({
      name: updateCategoryDto.name,
    });
    if (nameIsExit && (updateCategoryDto.name !== categoryFound.name)) {
      throw new BadRequestError("đã tồn tại tên danh mục này");
    }

    const updated = await categoryRepository.update(
      categoryId,
      updateCategoryDto,
    );

    if (!updated) {
      throw new InternalServerError();
    }

    return updated;
  }

  static async deleteCategory(categoryId:number):Promise<number>{
    const countAsset = await assetRepository.findByCondition({category_id:categoryId});
    if(countAsset.length > 0) {
      throw new BadRequestError(`Danh mục có ${countAsset.length} tài sản, không thể xóa`);
    }
    return await categoryRepository.softDelete(categoryId);
  }
}
export default CategoryService;
