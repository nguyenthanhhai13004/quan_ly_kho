import express from "express";
import { authentication } from "../../auths";
import transactionController from "../../controllers/transaction.controller";
import { uploadExcelMemory } from "../../configs/multer.config";
const router = express.Router();
router.use(authentication);
// ========================
// ALLOCATION – Cấp phát
// ========================
router.post("/allocations", transactionController.createAllocation);

// ========================
// RETURNS – Thu hồi
// ========================
router.post("/returns/:code", transactionController.processReturn);

// ========================
// DISPOSALS – Thanh lý
// ========================
router.post("/disposals", transactionController.createDisposal);

// ========================
// IMPORT – EXPORT thủ công & Excel
// ========================
router.post("/import-manual", transactionController.importManual);
router.post("/import-excel",uploadExcelMemory.single("file"), transactionController.importFromExcel);

router.post("/export-manual", transactionController.exportManual);
router.post("/export-excel", uploadExcelMemory.single("file"),transactionController.exportFromExcel);

// ========================
// VALIDATE EXCEL (kiểm tra hợp lệ file excel)
// ========================
router.post("/validate-import",uploadExcelMemory.single("file"),transactionController.validateTransactionImportExcel);
router.post("/validate-export",uploadExcelMemory.single("file"),transactionController.validateTransactionExportExcel);

// ========================
// MAINTENANCES – Bảo trì
// ========================
router.post("/maintenances", transactionController.createMaintenance);
router.put("/maintenances/:code", transactionController.updateMaintenance);

// ========================
// GET TRANSACTIONS
// ========================
router.get("/:code", transactionController.getTransactionDetail);
router.get("/", transactionController.getTransactions);
router.get("/asset/:assetCode",transactionController.getTransactionsForAsset)

// ========================
// GET STATS
// ========================
router.get("/import-export/stats", transactionController.getStatsImportExportWHOwn);


export default router;