import express from "express";
import { OK } from "../cores/success.response";
import authRouter from "./access"
import userRouter from "./users"
import rbacRouter from "./rbac"
import categoriesRouter from "./categories"
import assetsRouter from "./assets"
import warehouseRouter from "./warehouses"
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
router.use("/users",userRouter);
router.use("/rbac",rbacRouter);
router.use("/categories",categoriesRouter);
router.use("/assets",assetsRouter);
router.use("/warehouses",warehouseRouter);

export default router;