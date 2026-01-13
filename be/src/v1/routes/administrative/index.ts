import express from "express";
import administrativeController from "../../controllers/administrative.controller";
const router = express.Router();
router.get("/provinces",administrativeController.getAllProvinces)
router.get("/provinces/:provinceCode/wards",administrativeController.getWardsByProvince)
export default router;