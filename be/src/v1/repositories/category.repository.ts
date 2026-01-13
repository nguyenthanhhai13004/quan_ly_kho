import { CATEGORY_TABLE_NAME } from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import { Category } from "../models/category.model";
import db from "../databases/init.mysql-v2";

class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(CATEGORY_TABLE_NAME);
  }

  async findExistedCategories(names: string[]): Promise<string[]> {
    if (!names.length) return [];
    return db(this.tableName).whereIn("name", names).pluck("name");
  }
}
export default new CategoryRepository();
