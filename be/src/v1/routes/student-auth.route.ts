import express from "express";
import studentAuthController from "../controllers/student-auth.controller";
import { validate } from "../middlewares/validation.mdw";
import { LoginSchema } from "../dtos/auth/login.dto";
import { asyncHandler } from "../auths/utils";
import { authentication } from "../auths";

const studentAuthRouter = express.Router();
studentAuthRouter.post("/login", validate(LoginSchema), studentAuthController.login);
studentAuthRouter.get("/me", asyncHandler(authentication), studentAuthController.me);
studentAuthRouter.put("/update-profile", asyncHandler(authentication), studentAuthController.updateProfile);
studentAuthRouter.put("/change-password", asyncHandler(authentication), studentAuthController.changePassword);

export default studentAuthRouter;
