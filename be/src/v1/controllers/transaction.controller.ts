import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import TransactionService from "../services/transaction.service";
import { PaginationTransactionsDto } from "../dtos/transaction/pagination-transactions.dto";
import { parseTransactionTypes } from "../utils/parse-transaction-types";
import { ImportExcelDto } from "../dtos/transaction/import-excel.dto";
import ProcessReturnDto from "../dtos/transaction/process-return.dto";
import { PaginationTransactionsForAssetDto } from "../dtos/transaction/pagination-transactions-for-asset";
import KQNLogService from "../services/log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";
import { getRequestInfo } from "../utils/request-info";

class TransactionController {
  createAllocation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await TransactionService.createAllocation({
      ...req.body,
      created_by_user_id: req.user.id,
      warehouse_id: req.headers["x-warehouse-id"],
    });

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: req.body,
      ip,
      url,
    });

    return new OK({
      message: "Tạo cấp phát thành công",
      data: result,
    }).send(res);
  };

  // thu hồi
  processReturn = async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.processReturn({
      ...req.body,
      returned_by_user_id: req.user.id,
      warehouse_id: req.headers["x-warehouse-id"],
      transaction_code: req.params.code,
    });
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: result,
      ip,
      url,
    });
    return new OK({
      message: "Thu hồi tài sản thành công",
      data: result,
    }).send(res);
  };

  createDisposal = async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.createDisposal({
      ...req.body,
      created_by_user_id: req.user.id,
      warehouse_id: req.headers["x-warehouse-id"],
    });
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: result,
      ip,
      url,
    });
    return new OK({
      message: "Tạo thanh lý tài sản thành công",
      data: result,
    }).send(res);
  };

  importManual = async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.importManual({
      ...req.body,
      created_by_user_id: req.user.id,
      warehouse_id: req.headers["x-warehouse-id"],
    });

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: {
        ...req.body,
        created_by_user_id: req.user.id,
        warehouse_id: req.headers["x-warehouse-id"],
      },
      ip,
      url,
    });
    return new OK({
      message: "Import thủ công thành công",
      data: result,
    }).send(res);
  };

  importFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.importFromExcel({
      ...req.body,
      file: req.file,
      warehouse_id: req.headers["x-warehouse-id"],
      created_by_user_id: req.user.id,
    });

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.IMPORT,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: {
        ...req.body,
        created_by_user_id: req.user.id,
        warehouse_id: req.headers["x-warehouse-id"],
      },
      ip,
      url,
    });
    return new OK({
      message: "Import Excel thành công",
      data: result,
    }).send(res);
  };

  exportManual = async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.exportManual({
      ...req.body,
      created_by_user_id: req.user.id,
      warehouse_id: req.headers["x-warehouse-id"],
    });

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: {
        ...req.body,
        created_by_user_id: req.user.id,
        warehouse_id: req.headers["x-warehouse-id"],
      },
      ip,
      url,
    });

    return new OK({
      message: "Export thủ công thành công",
      data: result,
    }).send(res);
  };

  exportFromExcel = async (req: Request, res: Response, next: NextFunction) => {
    const result = await TransactionService.exportFromExcel({
      ...req.body,
      file: req.file,
      warehouse_id: req.headers["x-warehouse-id"],
      created_by_user_id: req.user.id,
    });
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.IMPORT,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: {
        ...req.body,
        created_by_user_id: req.user.id,
        warehouse_id: req.headers["x-warehouse-id"],
      },
      ip,
      url,
    });
    return new OK({
      message: "Export Excel thành công",
      data: result,
    }).send(res);
  };

  validateTransactionImportExcel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Kiểm tra file Excel thành công",
      data: await TransactionService.validateTransactionImportExcel(
        warehouse_id,
        req.file,
      ),
    }).send(res);
  };

  validateTransactionExportExcel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Kiểm tra file Excel thành công",
      data: await TransactionService.validateTransactionExportExcel(
        warehouse_id,
        req.file,
      ),
    }).send(res);
  };

  createMaintenance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await await TransactionService.createMaintenance({
      ...req.body,
      created_by_user_id: req.user.id,
      warehouse_id: req.headers["x-warehouse-id"],
    });

    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.CREATE,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: {
        ...req.body,
        created_by_user_id: req.user.id,
        warehouse_id: req.headers["x-warehouse-id"],
      },
      ip,
      url,
    });
    return new OK({
      message: "Tạo bảo trì thành công",
      data: result,
    }).send(res);
  };

  updateMaintenance = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = await TransactionService.updateMaintenance({
      ...req.body,
      modified_by_user_id_by_user_id: req.user.id,
      warehouse_id: req.headers["x-warehouse-id"],
      transaction_code: req.params.code,
    });
    const { ip, url } = getRequestInfo(req);
    await KQNLogService.createLog({
      action_code: LogAction.EDIT,
      controller_code: LogController.TRANSACTION,
      username: req.user.username,
      data: {
        ...req.body,
        created_by_user_id: req.user.id,
        warehouse_id: req.headers["x-warehouse-id"],
      },
      ip,
      url,
    });
    return new OK({
      message: "Cập nhật bảo trì thành công",
      data:result,
    }).send(res);
  };

  getTransactionDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    return new OK({
      message: "Lấy chi tiết giao dịch thành công",
      data: await TransactionService.getTransactionDetail(req.params.code),
    }).send(res);
  };

  getTransactions = async (req: Request, res: Response, next: NextFunction) => {
    const types = parseTransactionTypes(
      req.query.types as string | string[] | undefined,
    );
    const query = {
      page: req.query.page || 1,
      size: req.query.size || 20,
      code: req.query.code as string | undefined,
      created_by_user_id: req.query.created_by_user_id
        ? Number(req.query.created_by_user_id)
        : undefined,
      from_date: req.query.from_date as string | undefined,
      to_date: req.query.to_date as string | undefined,
      types,
    } as PaginationTransactionsDto;
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Lấy danh sách giao dịch thành công",
      data: await TransactionService.getTransactions(query, warehouse_id),
    }).send(res);
  };

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

  getTransactionsForAsset = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const types = parseTransactionTypes(
      req.query.types as string | string[] | undefined,
    );
    const query = {
      page: req.query.page || 1,
      size: req.query.size || 20,
      types,
    } as PaginationTransactionsForAssetDto;
    const warehouse_id = Number(req.headers["x-warehouse-id"]);
    return new OK({
      message: "Lấy danh giao dịch thành công",
      data: await TransactionService.getTransactionsForAsset({
        ...query,
        warehouse_id,
        asset_code: req.params.assetCode,
      }),
    }).send(res);
  };
}

export default new TransactionController();
