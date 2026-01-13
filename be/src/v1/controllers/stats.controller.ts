import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import TransactionService from "../services/transaction.service";
import { PaginationTransactionsDto } from "../dtos/transaction/pagination-transactions.dto";
import { parseTransactionTypes } from "../utils/parse-transaction-types";
import { ImportExcelDto } from "../dtos/transaction/import-excel.dto";
import CategoryService from "../services/category.service";
import WarehouseService from "../services/warehouse.service";

class StatsController {
  getStatsImportExportWHOwn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Lấy danh giao dịch thành công",
      data: await TransactionService.getStatsImportExportWHOwn(warehouse_id),
    }).send(res);
  };

  getStatsByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Lấy thành công",
      data: await CategoryService.getStatsByCategory(warehouse_id)
    }).send(res);
  };

   getStatsAssetStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Lấy thành công",
      data: await WarehouseService.getStatsAssetStatus(warehouse_id)
    }).send(res);
  };

   getStatsAssetInWH = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Lấy thành công",
      data: await WarehouseService.getStatsAssetInWH(warehouse_id)
    }).send(res);
  };
}

export default new StatsController();
