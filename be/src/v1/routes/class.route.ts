import { Router } from "express";
import { asyncHandler } from "../auths/utils";
import { authentication } from "../auths";
import ClassController from "../controllers/class.controller";
import { grantAccess } from "../middlewares/rbac.mdw";
import { PermissionsEnum } from "../cores/enums/permissons.enum";

const classRouter = Router();

classRouter.use(asyncHandler(authentication));
classRouter.use(grantAccess([PermissionsEnum.MANAGE_USER]));

classRouter.get("/", asyncHandler(ClassController.getAll));
classRouter.get("/all", asyncHandler(ClassController.getAllList));
classRouter.post("/", asyncHandler(ClassController.createClass));
classRouter.put("/:id", asyncHandler(ClassController.updateClass));
classRouter.get("/:id", asyncHandler(ClassController.getById));
classRouter.delete("/:id", asyncHandler(ClassController.delete));

export default classRouter;
