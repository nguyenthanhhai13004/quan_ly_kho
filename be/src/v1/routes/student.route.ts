import { Router } from "express";
import { asyncHandler } from "../auths/utils";
import { authentication } from "../auths";
import StudentController from "../controllers/student.controller";
import { grantAccess, grantAccessAny } from "../middlewares/rbac.mdw";
import { PermissionsEnum } from "../cores/enums/permissons.enum";

const studentRouter = Router();

studentRouter.use(asyncHandler(authentication));

studentRouter.get("/", grantAccessAny([PermissionsEnum.MANAGE_USER, PermissionsEnum.COMMANDER_STUDENTS_VIEW]), asyncHandler(StudentController.getAll));
studentRouter.post("/", grantAccess([PermissionsEnum.MANAGE_USER]), asyncHandler(StudentController.createStudent));
studentRouter.put("/:id", grantAccessAny([PermissionsEnum.MANAGE_USER, PermissionsEnum.COMMANDER_STUDENTS_VIEW]), asyncHandler(StudentController.updateStudent));
studentRouter.put("/:id/reset-password", grantAccessAny([PermissionsEnum.MANAGE_USER, PermissionsEnum.COMMANDER_STUDENTS_VIEW]), asyncHandler(StudentController.resetPassword));
studentRouter.get("/:id", grantAccessAny([PermissionsEnum.MANAGE_USER, PermissionsEnum.COMMANDER_STUDENTS_VIEW]), asyncHandler(StudentController.getById));
studentRouter.delete("/:id", grantAccess([PermissionsEnum.MANAGE_USER]), asyncHandler(StudentController.delete));

export default studentRouter;
