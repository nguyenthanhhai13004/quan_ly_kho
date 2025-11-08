import { NextFunction, Request, Response } from "express";
import {BadRequestError, ForbiddenError } from "../cores/error.response";
import { HEADERS } from "../cores/constants/headers.constants";

export const WarehouseMdw = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const warehouse_id = req.headers[HEADERS.X_WAREHOUSE_ID] as string;
  if (!warehouse_id) {
    throw new BadRequestError("x-warehouse-id là bắt buộc");
  }
  
  const warehouse_ids = req.user.warehouse_ids;
  
  if (warehouse_ids && !warehouse_ids.includes(Number(warehouse_id))){
    throw new ForbiddenError("bạn không có quyền với kho này");
  }
  return next();
};
