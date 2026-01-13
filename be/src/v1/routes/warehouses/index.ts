import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import warehouseController from "../../controllers/warehouse.controller";
const router = express.Router();
router.use(asyncHandler(authentication));
router.get("/own",warehouseController.getAllWarehouseOwn)
router.get("/any",warehouseController.getAllWarehouseAny)
router.get("/assets",warehouseController.getAllAssetsInWarehouseOwn)
router.get("/batches/need-maintenance",warehouseController.getAllBatchesNeedMaintenanceInWarehouseOwn)
// create warehouse
router.post("/",warehouseController.createWarehouse)
export default router;