import { Request, Response, NextFunction } from "express";
import { OK } from "../cores/success.response";
import ReportService from "../services/report.service";
import {
  renderAllocationReport,
  renderDisposalReport,
  renderInventoryReport,
  renderMaintenanceReport,
} from "../utils/render-html";
import { ReportTemplates } from "../cores/constants/report-template.constant";
import dayjs from "dayjs";
import { ExcelService } from "../services/excel.service";
import { getRequestInfo } from "../utils/request-info";
import KQNLogService from "../services/log.service";
import { LogAction, LogController } from "../cores/enums/logs.enum";

class ReportController {
  getInventoryReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"]);
      const data = await ReportService.getInventoryReport({ warehouse_id });
      const html = renderInventoryReport(
        ReportTemplates.INVENTORY,
        data.categories,
        data.warehouse_name,
        dayjs(new Date()).format("DD/MM/YYYY"),
        data.total_quantity,
      );
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      next(error);
    }
  };

  downloadInventoryReportExcel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"] || 1);
      const data = await ReportService.getInventoryReport({ warehouse_id });
      const workbook = await ExcelService.generateInventoryWorkbook(
        data.categories,
        data.warehouse_name,
        dayjs(new Date()).format("DD/MM/YYYY"),
        data.total_quantity,
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=MaintenanceReport.xlsx",
      );

      await workbook.xlsx.write(res);
      const { ip, url } = getRequestInfo(req);
      await KQNLogService.createLog({
        action_code: LogAction.EXPORT,
        controller_code: LogController.TRANSACTION,
        username: req.user.username,
        data: req.body,
        ip,
        url,
      });
      res.end();
    } catch (error) {
      next(error);
    }
  };

  getAllocationReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"]);
      const start_date = req.query.start_date as string;
      const end_date = req.query.end_date as string;

      const data = await ReportService.getAllocationReport({
        warehouse_id,
        start_date,
        end_date,
      });

      const html = renderAllocationReport(ReportTemplates.ALLOCATION, data);
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      next(error);
    }
  };

  getMaintenanceReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"]);
      const status = req.query.status as string | undefined;
      const now = new Date();
      const quarterParam = req.query.quarter;
      const yearParam = req.query.year;

      const quarter =
        quarterParam !== undefined
          ? Number(quarterParam)
          : Math.floor((now.getMonth() + 3) / 3);

      const year =
        yearParam !== undefined ? Number(yearParam) : now.getFullYear();

      const data = await ReportService.getMaintenanceReport({
        warehouse_id,
        status,
        quarter,
        year,
      });

      const html = renderMaintenanceReport(ReportTemplates.MAINTENANCE, {
        ...data,
        quarter,
        year,
      });
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      next(error);
    }
  };

  getDisposalReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"]);
      const data = await ReportService.getDisposalReport({ warehouse_id });
      const html = renderDisposalReport(
        ReportTemplates.DISPOSAL,
        {
          transactions: data.transactions,
          totalDepreciation: data.totalDepreciation,
        },
        data.warehouse_name,
        dayjs(new Date()).format("DD/MM/YYYY"),
      );
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      next(error);
    }
  };

  downloadMaintenanceReportExcel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"]);
      const status = req.query.status as string | undefined;
      const now = new Date();
      const quarterParam = req.query.quarter;
      const yearParam = req.query.year;

      const quarter =
        quarterParam !== undefined
          ? Number(quarterParam)
          : Math.floor((now.getMonth() + 3) / 3);

      const year =
        yearParam !== undefined ? Number(yearParam) : now.getFullYear();

      const data = await ReportService.getMaintenanceReport({
        warehouse_id,
        status,
        quarter,
        year,
      });

      const workbook = await ExcelService.generateMaintenanceWorkbook({
        ...data,
        quarter,
        year,
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=MaintenanceReport.xlsx",
      );

      await workbook.xlsx.write(res);
      const { ip, url } = getRequestInfo(req);
      await KQNLogService.createLog({
        action_code: LogAction.EXPORT,
        controller_code: LogController.TRANSACTION,
        username: req.user.username,
        data: req.body,
        ip,
        url,
      });
      res.end();
    } catch (error) {
      next(error);
    }
  };

  downloadDisposalReportExcel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"]);
      const data = await ReportService.getDisposalReport({ warehouse_id });
      const workbook = await ExcelService.generateDisposalWorkbook(data);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=DisposalReport.xlsx",
      );

      await workbook.xlsx.write(res);
      const { ip, url } = getRequestInfo(req);
      await KQNLogService.createLog({
        action_code: LogAction.EXPORT,
        controller_code: LogController.TRANSACTION,
        username: req.user.username,
        data: req.body,
        ip,
        url,
      });
      res.end();
    } catch (error) {
      next(error);
    }
  };

  downloadAllocationReportExcel = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const warehouse_id = Number(req.headers["x-warehouse-id"] || 1);
      const start_date = req.query.start_date as string;
      const end_date = req.query.end_date as string;
      const data = await ReportService.getAllocationReport({
        warehouse_id,
        start_date,
        end_date,
      });
      const workbook = await ExcelService.generateAllocationWorkbook(
        data,
        dayjs(new Date()).format("DD/MM/YYYY"),
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=MaintenanceReport.xlsx",
      );

      await workbook.xlsx.write(res);
      const { ip, url } = getRequestInfo(req);
      await KQNLogService.createLog({
        action_code: LogAction.EXPORT,
        controller_code: LogController.TRANSACTION,
        username: req.user.username,
        data: req.body,
        ip,
        url,
      });
      res.end();
    } catch (error) {
      next(error);
    }
  };
}

export default new ReportController();
