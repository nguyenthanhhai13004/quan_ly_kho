import { Router } from "express";
import { asyncHandler } from "../auths/utils";
import { authentication } from "../auths";
import AdvisorRequestController from "../controllers/advisor-request.controller";
import { grantAccess } from "../middlewares/rbac.mdw";
import { PermissionsEnum } from "../cores/enums/permissons.enum";

const advisorRequestRouter = Router();

advisorRequestRouter.use(asyncHandler(authentication));

// Get requests of advisor (advisor themselves) or create requests
advisorRequestRouter.get(
  "/my-requests",
  grantAccess([PermissionsEnum.COMMANDER_REQUESTS_MANAGE]),
  asyncHandler(AdvisorRequestController.getAdvisorRequests)
);

advisorRequestRouter.post(
  "/",
  grantAccess([PermissionsEnum.COMMANDER_REQUESTS_MANAGE]),
  asyncHandler(AdvisorRequestController.createRequest)
);

// Warehouse officer endpoints
advisorRequestRouter.get(
  "/all",
  grantAccess([PermissionsEnum.WAREHOUSE_OFFICER_REQUESTS_VIEW]),
  asyncHandler(AdvisorRequestController.getAllRequests)
);

advisorRequestRouter.put(
  "/:id/process",
  grantAccess([PermissionsEnum.WAREHOUSE_OFFICER_REQUESTS_APPROVE]),
  asyncHandler(AdvisorRequestController.processRequest)
);

advisorRequestRouter.post(
  "/:id/fulfill-allocation",
  grantAccess([PermissionsEnum.WAREHOUSE_OFFICER_REQUESTS_APPROVE]),
  asyncHandler(AdvisorRequestController.fulfillAllocationRequest)
);

advisorRequestRouter.post(
  "/:id/fulfill-recall",
  grantAccess([PermissionsEnum.WAREHOUSE_OFFICER_REQUESTS_APPROVE]),
  asyncHandler(AdvisorRequestController.fulfillRecallRequest)
);

export default advisorRequestRouter;
