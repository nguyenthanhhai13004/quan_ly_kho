import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import assetController from "../../controllers/asset.controller";
import { validate } from "../../middlewares/validation.mdw";
import { CreateAssetSchema } from "../../dtos/asset/create-asset.dto";
import { UpdateAssetSchema } from "../../dtos/asset/update-asset.dto";
import { WarehouseMdw } from "../../middlewares/warehouse.mdw";
const router = express.Router();
router.use(asyncHandler(authentication));
router.use(asyncHandler(WarehouseMdw));
router.get("",assetController.getAllAssets)
router.post("",validate(CreateAssetSchema),assetController.createAsset)
router.put("/:id",validate(UpdateAssetSchema),assetController.updateAsset)
router.delete("/:id",assetController.deleteAsset)
router.get("/:id",assetController.getAssetDetail)
export default router;