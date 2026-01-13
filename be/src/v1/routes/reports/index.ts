import express from "express";
import { authentication } from "../../auths";
import reportController from "../../controllers/report.controller";
const router = express.Router();
router.get("/inventory/export-excel",reportController.downloadInventoryReportExcel)
router.get("/allocation/export-excel",reportController.downloadAllocationReportExcel)
router.get("/maintenance/export-excel",reportController.downloadMaintenanceReportExcel)
router.get("/disposal/export-excel",reportController.downloadDisposalReportExcel)
router.use(authentication);
router.get("/inventory",reportController.getInventoryReport)
router.get("/allocation",reportController.getAllocationReport)
router.get("/maintenance",reportController.getMaintenanceReport)
router.get("/disposal",reportController.getDisposalReport)
export default router;