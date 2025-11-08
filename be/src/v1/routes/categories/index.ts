import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import categoryController from "../../controllers/category.controller";
import { validate } from "../../middlewares/validation.mdw";
import { CreateCategorySchema } from "../../dtos/category/create-category.dto";
import { UpdateCategorySchema } from "../../dtos/category/update-category.dto";
const router = express.Router();
router.use(asyncHandler(authentication));
router.get("",categoryController.getAllCategories)
router.post("",validate(CreateCategorySchema),categoryController.createCategory)
router.put("/:id",validate(UpdateCategorySchema),categoryController.updateCategory)
router.delete("/:id",categoryController.deleteCategory)
export default router;