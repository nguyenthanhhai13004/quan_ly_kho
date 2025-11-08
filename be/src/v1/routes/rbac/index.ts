import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import rbacController from "../../controllers/rbac.controller";
import { validate } from "../../middlewares/validation.mdw";
import { CreateRoleSchema } from "../../dtos/rbac/create-role.dto";
const router = express.Router();
router.use(asyncHandler(authentication));
router.post("/roles",validate(CreateRoleSchema),rbacController.createNewRole)
router.get("/roles",rbacController.getAllRoles)
router.get("/permissions",rbacController.getAllPermissons)
export default router;