import express from "express";
import { authentication } from "../../auths";
import warehouseController from "../../controllers/warehouse.controller";
const router = express.Router();
router.use(authentication)
router.get("/batch/:batch_code", warehouseController.getDetailBatch);
router.get("/:asset_code/batches", warehouseController.getAllPatchByAssetInWHOwn);
export default router;
