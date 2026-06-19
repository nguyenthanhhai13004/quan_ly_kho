import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import AdvisorRequestService from "../services/advisor-request.service";
import { PaginationRequestsDto } from "../repositories/advisor-request.repository";

class AdvisorRequestController {
  createRequest = async (req: Request, res: Response, next: NextFunction) => {
    const advisorId = req.user.id;
    const { student_id, class_id, type, note, items } = req.body;
    const data = await AdvisorRequestService.createRequest(advisorId, {
      student_id: student_id ? Number(student_id) : null,
      class_id: class_id ? Number(class_id) : null,
      type: Number(type),
      note,
      items: Array.isArray(items) ? items.map((item: any) => ({
        asset_id: Number(item.asset_id),
        quantity: Number(item.quantity),
        allocation_transaction_code: item.allocation_transaction_code || null,
      })) : undefined,
    });
    return new OK({
      message: "Tạo yêu cầu thành công",
      data,
    }).send(res);
  };

  processRequest = async (req: Request, res: Response, next: NextFunction) => {
    const officerId = req.user.id;
    const requestId = Number(req.params.id);
    const { status, response_note } = req.body;
    const data = await AdvisorRequestService.processRequest(
      officerId,
      requestId,
      Number(status),
      response_note
    );
    return new OK({
      message: "Xử lý yêu cầu thành công",
      data,
    }).send(res);
  };

  fulfillAllocationRequest = async (req: Request, res: Response, next: NextFunction) => {
    const officerId = req.user.id;
    const requestId = Number(req.params.id);
    const warehouseId = Number(req.headers["x-warehouse-id"]);
    
    if (!warehouseId) {
      return res.status(400).json({ message: "Vui lòng chọn kho để thao tác" });
    }

    const { allocation_data, response_note } = req.body;
    const data = await AdvisorRequestService.fulfillAllocationRequest(
      officerId,
      requestId,
      warehouseId,
      { allocation_data, response_note }
    );
    return new OK({
      message: "Cấp phát tài sản thành công",
      data,
    }).send(res);
  };

  fulfillRecallRequest = async (req: Request, res: Response, next: NextFunction) => {
    const officerId = req.user.id;
    const requestId = Number(req.params.id);
    const warehouseId = Number(req.headers["x-warehouse-id"]);

    if (!warehouseId) {
      return res.status(400).json({ message: "Vui lòng chọn kho để thao tác" });
    }

    const { import_data, response_note, transaction_codes, return_date, request_ids } = req.body;
    const data = await AdvisorRequestService.fulfillRecallRequest(
      officerId,
      requestId,
      warehouseId,
      { import_data, response_note, transaction_codes, return_date, request_ids }
    );
    return new OK({
      message: "Thu hồi tài sản thành công",
      data,
    }).send(res);
  };

  getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
    const query = {
      page: Number(req.query.page || 1),
      size: Number(req.query.size || 20),
      keyword: (req.query.keyword as string) || "",
      status: req.query.status !== undefined ? Number(req.query.status) : undefined,
      type: req.query.type !== undefined ? Number(req.query.type) : undefined,
      class_id: req.query.class_id ? Number(req.query.class_id) : undefined,
      start_date: (req.query.start_date as string) || undefined,
      end_date: (req.query.end_date as string) || undefined,
    } as PaginationRequestsDto;
    const data = await AdvisorRequestService.getAllRequests(req.user, query);
    return new OK({
      message: "Lấy danh sách yêu cầu thành công",
      data,
    }).send(res);
  };

  getAdvisorRequests = async (req: Request, res: Response, next: NextFunction) => {
    const advisorId = req.user.id;
    const query = {
      page: Number(req.query.page || 1),
      size: Number(req.query.size || 20),
      keyword: (req.query.keyword as string) || "",
      status: req.query.status !== undefined ? Number(req.query.status) : undefined,
      type: req.query.type !== undefined ? Number(req.query.type) : undefined,
      start_date: (req.query.start_date as string) || undefined,
      end_date: (req.query.end_date as string) || undefined,
    } as PaginationRequestsDto;
    const data = await AdvisorRequestService.getAdvisorRequests(advisorId, query);
    return new OK({
      message: "Lấy danh sách yêu cầu của chỉ huy thành công",
      data,
    }).send(res);
  };
}

export default new AdvisorRequestController();
