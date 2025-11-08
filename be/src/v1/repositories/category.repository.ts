import { CATEGORY_TABLE_NAME } from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import { Category } from "../models/category.model";

class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(CATEGORY_TABLE_NAME);
  }
}
export default new CategoryRepository();
