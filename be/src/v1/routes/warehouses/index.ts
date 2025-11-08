import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import warehouseController from "../../controllers/warehouse.controller";
const router = express.Router();
router.use(asyncHandler(authentication));
router.get("",warehouseController.getAllWarehouseOwn)
export default router;