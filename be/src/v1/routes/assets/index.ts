import express from "express";
import { asyncHandler } from "../../auths/utils";
import { authentication } from "../../auths";
import assetController from "../../controllers/asset.controller";
import { validate } from "../../middlewares/validation.mdw";
import { CreateAssetSchema } from "../../dtos/asset/create-asset.dto";
import { UpdateAssetSchema } from "../../dtos/asset/update-asset.dto";
import { WarehouseMdw } from "../../middlewares/warehouse.mdw";
import { uploadDisk } from "../../configs/multer.config";
import { cleanupUpload } from "../../middlewares/cleanup-upload.mdw";
const router = express.Router();
router.use(asyncHandler(authentication));
router.get("/own",assetController.getAllAssetsAllocation)
router.use(asyncHandler(WarehouseMdw));
router.get("",assetController.getAllAssets)
router.post("",uploadDisk.single("file"),validate(CreateAssetSchema),cleanupUpload,assetController.createAsset)
router.put("/:id",uploadDisk.single("file"),validate(UpdateAssetSchema),assetController.updateAsset)
router.delete("/:id",assetController.deleteAsset)
router.get("/:assetCode",assetController.getAssetDetail)
router.post("/generate-code",assetController.generateCode)
export default router;