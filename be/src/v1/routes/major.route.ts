import { Router } from "express";
import { asyncHandler } from "../auths/utils";
import { authentication } from "../auths";
import MajorController from "../controllers/major.controller";
import { grantAccess } from "../middlewares/rbac.mdw";
import { PermissionsEnum } from "../cores/enums/permissons.enum";

const majorRouter = Router();

majorRouter.use(asyncHandler(authentication));
majorRouter.use(grantAccess([PermissionsEnum.MANAGE_USER]));

majorRouter.get("/", asyncHandler(MajorController.getAll));
majorRouter.get("/all", asyncHandler(MajorController.getAllList));
majorRouter.post("/", asyncHandler(MajorController.createMajor));
majorRouter.put("/:id", asyncHandler(MajorController.updateMajor));
majorRouter.get("/:id", asyncHandler(MajorController.getById));
majorRouter.delete("/:id", asyncHandler(MajorController.delete));

export default majorRouter;
