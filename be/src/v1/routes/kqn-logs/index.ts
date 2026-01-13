import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import kqnLogController from "../../controllers/kqn-log.controller";
const router = express.Router();
router.use(asyncHandler(authentication));
router.get("",kqnLogController.getAllLogs)
export default router