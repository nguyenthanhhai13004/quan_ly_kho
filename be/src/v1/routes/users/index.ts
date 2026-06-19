import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import userController from "../../controllers/user.controller";
import { validate } from "../../middlewares/validation.mdw";
import { CreateUserSchema } from "../../dtos/user/create-user.dto";
import { UpdatedUserSchema } from "../../dtos/user/update-user.dto";
import { uploadDisk } from "../../configs/multer.config";
const router = express.Router();

const parseMultipartUserData = (req: any, res: any, next: any) => {
  if (req.body.role_id !== undefined) {
    req.body.role_id = Number(req.body.role_id);
  }
  if (req.body.class_id !== undefined) {
    if (req.body.class_id === 'null' || req.body.class_id === '' || req.body.class_id === 'undefined') {
      req.body.class_id = null;
    } else {
      req.body.class_id = Number(req.body.class_id);
    }
  }
  if (req.body.major_id !== undefined) {
    if (req.body.major_id === 'null' || req.body.major_id === '' || req.body.major_id === 'undefined') {
      req.body.major_id = null;
    } else {
      req.body.major_id = Number(req.body.major_id);
    }
  }
  if (req.body.active !== undefined) {
    req.body.active = Number(req.body.active);
  }
  if (req.body['warehouse_ids[]'] !== undefined) {
    const rawIds = req.body['warehouse_ids[]'];
    const ids = Array.isArray(rawIds) ? rawIds : [rawIds];
    req.body.warehouse_ids = ids.map((id: any) => Number(id));
    delete req.body['warehouse_ids[]'];
  } else if (req.body.warehouse_ids !== undefined) {
    const rawIds = req.body.warehouse_ids;
    const ids = Array.isArray(rawIds) ? rawIds : [rawIds];
    req.body.warehouse_ids = ids.map((id: any) => Number(id));
  }
  next();
};

router.use(asyncHandler(authentication));
router.get("/",userController.getAllUsers)
router.post("/",uploadDisk.single("file"),parseMultipartUserData,validate(CreateUserSchema),userController.createUser)
router.put("/:id",uploadDisk.single("file"),parseMultipartUserData,validate(UpdatedUserSchema),userController.updateUser)
router.post("/:id/reset-password",userController.resetPasswordAny)
router.get("/:id",userController.getUserDetail)
export default router;