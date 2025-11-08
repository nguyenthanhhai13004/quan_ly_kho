import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import userController from "../../controllers/user.controller";
import { validate } from "../../middlewares/validation.mdw";
import { CreateUserSchema } from "../../dtos/user/create-user.dto";
import { UpdatedUserSchema } from "../../dtos/user/update-user.dto";
const router = express.Router();
router.use(asyncHandler(authentication));
router.get("/",userController.getAllUsers)
router.post("/",validate(CreateUserSchema),userController.createUser)
router.put("/:id",validate(UpdatedUserSchema),userController.updateUser)
router.post("/:id/reset-password",userController.resetPasswordAny)
router.get("/:id",userController.getUserDetail)
export default router;