import express from "express";
import { OK } from "../cores/success.response";
import authRouter from "./access"
import userRouter from "./users"
import rbacRouter from "./rbac"
import categoriesRouter from "./categories"
import assetsRouter from "./assets"
import warehouseRouter from "./warehouses"
import transactionRouter from "./transactions"
import warehouseAssetRouter from "./warehouse-asset";
import statsRouter from "./stats";
import reportsRouter from "./reports";
import administrativeRouter from "./administrative";
import logsRouter from "./kqn-logs";
const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check API
 *     description: Kiểm tra tình trạng hoạt động của server.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: server work
 *                 data:
 *                   type: string
 *                   example: ""
 */
router.get("/health",(req,res,next)=>{
    return new OK({
        message:"server work",
        data:""
    }).send(res);
});

router.use("/auth",authRouter);
router.use("/assets",assetsRouter);
router.use("/users",userRouter);
router.use("/rbac",rbacRouter);
router.use("/categories",categoriesRouter);
router.use("/warehouses",warehouseRouter);
router.use("/transactions",transactionRouter);
router.use("/warehouse-asset",warehouseAssetRouter);
router.use("/stats",statsRouter);
router.use("/reports",reportsRouter);
router.use("/administrative",administrativeRouter);
router.use("/logs",logsRouter);
export default router;