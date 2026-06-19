import advisorRequestRepository, { PaginationRequestsDto } from "../repositories/advisor-request.repository";
import userRepository from "../repositories/user.repository";
import { BadRequestError, NotFoundError } from "../cores/error.response";
import { AdvisorRequest } from "../models/advisor-request.model";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";

class AdvisorRequestService {
  static async createRequest(
    advisorId: number,
    data: {
      student_id?: number | null;
      class_id?: number | null;
      type: number; // 1: Cấp phát, 2: Thu hồi, 4: Khác
      note?: string;
      items?: { asset_id: number; quantity: number; allocation_transaction_code?: string }[];
    }
  ): Promise<boolean> {
    // 1. Validate type
    if (![1, 2, 4].includes(data.type)) {
      throw new BadRequestError("Loại yêu cầu không hợp lệ (1: Cấp phát, 2: Thu hồi, 4: Khác)");
    }

    if (data.type !== 4 && (!data.items || data.items.length === 0)) {
      throw new BadRequestError("Danh sách tài sản yêu cầu không được rỗng");
    }

    // 2. Get advisor to verify major_id
    const advisor = await userRepository.findUserById(advisorId);
    if (!advisor) {
      throw new NotFoundError("Tài khoản chỉ huy không tồn tại");
    }

    if (!advisor.major_id) {
      throw new BadRequestError("Chỉ huy chưa được gán quản lý hệ nào");
    }

    if (!advisor.warehouse_ids || advisor.warehouse_ids.length === 0) {
      throw new BadRequestError("Chỉ huy chưa được gán quản lý kho nào. Vui lòng liên hệ Admin.");
    }

    const warehouseId = advisor.warehouse_ids[0];

    const db = require("../databases/init.mysql-v2").default;
    let resolvedClassId: number;

    if (data.student_id) {
      const student = await db("students").where({ id: data.student_id }).first();
      if (!student) {
        throw new NotFoundError("Học viên không tồn tại");
      }
      const classBelongs = await db("classes")
        .where({ id: student.class_id, major_id: advisor.major_id })
        .first();
      if (!classBelongs) {
        throw new BadRequestError("Học viên không thuộc hệ quản lý của bạn");
      }
      resolvedClassId = student.class_id;
    } else {
      if (!data.class_id) {
        throw new BadRequestError("Vui lòng chọn lớp học để yêu cầu");
      }
      const classBelongs = await db("classes")
        .where({ id: data.class_id, major_id: advisor.major_id })
        .first();
      if (!classBelongs) {
        throw new BadRequestError("Lớp học không thuộc hệ quản lý của bạn");
      }
      resolvedClassId = data.class_id;
    }

    // 3. Validate assets
    if (data.items && data.items.length > 0) {
      const assetIds = data.items.map(item => item.asset_id);
      const count = await db("assets")
        .whereIn("id", assetIds)
        .count("id as total")
        .first();
      if (Number(count?.total || 0) !== assetIds.length) {
        throw new BadRequestError("Một hoặc nhiều tài sản yêu cầu không tồn tại");
      }
    }

    // 4. Prepare requests array
    let requestsToStore: any[] = [];
    if (data.type === 4 && (!data.items || data.items.length === 0)) {
      requestsToStore = [{
        advisor_id: advisorId,
        warehouse_id: warehouseId,
        class_id: resolvedClassId,
        student_id: data.student_id || null,
        asset_id: null,
        quantity: null,
        type: data.type,
        status: 0, // Pending
        note: data.note || null,
        allocation_transaction_code: null,
      }];
    } else {
      requestsToStore = (data.items || []).map(item => ({
        advisor_id: advisorId,
        warehouse_id: warehouseId,
        class_id: resolvedClassId,
        student_id: data.student_id || null,
        asset_id: item.asset_id,
        quantity: item.quantity,
        type: data.type,
        status: 0, // Pending
        note: data.note || null,
        allocation_transaction_code: item.allocation_transaction_code || null,
      }));
    }

    // 4. Store requests
    return await advisorRequestRepository.storeMany(requestsToStore);
  }

  static async processRequest(
    processedByUserId: number,
    requestId: number,
    status: number, // 1: Approved, 2: Rejected
    response_note?: string
  ): Promise<AdvisorRequest | null> {
    const request = await advisorRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundError("Yêu cầu không tồn tại");
    }

    if (request.status !== 0) {
      throw new BadRequestError("Yêu cầu này đã được xử lý trước đó");
    }

    // Validate officer's warehouse access
    const officer = await userRepository.findUserById(processedByUserId);
    if (officer && officer.role_id !== 1) { // Not Admin
      if (!request.warehouse_id) {
        throw new BadRequestError("Yêu cầu này không chứa thông tin kho");
      }
      if (!officer.warehouse_ids || !officer.warehouse_ids.includes(request.warehouse_id)) {
        throw new BadRequestError("Bạn không có quyền xử lý yêu cầu thuộc kho này");
      }
    }

    if (status !== 1 && status !== 2) {
      throw new BadRequestError("Trạng thái xử lý không hợp lệ");
    }

    if (status === 2 && !response_note) {
      throw new BadRequestError("Vui lòng nhập lý do từ chối (Phản hồi)");
    }

    return await advisorRequestRepository.update(requestId, {
      status,
      response_note: response_note || null,
      processed_by_user_id: processedByUserId,
    });
  }

  static async fulfillAllocationRequest(
    processedByUserId: number,
    requestId: number,
    warehouseId: number,
    data: {
      allocation_data: any; // CreateAllocationDto
      response_note?: string;
    }
  ): Promise<AdvisorRequest | null> {
    const request = await advisorRequestRepository.findById(requestId);
    if (!request) {
      throw new NotFoundError("Yêu cầu không tồn tại");
    }

    if (request.status !== 0) {
      throw new BadRequestError("Yêu cầu này đã được xử lý trước đó");
    }

    if (request.type !== 1) {
      throw new BadRequestError("Yêu cầu này không phải là yêu cầu cấp phát");
    }

    const { allocation_data, response_note } = data;
    if (!allocation_data || !allocation_data.items || allocation_data.items.length === 0) {
      throw new BadRequestError("Vui lòng chọn ít nhất 1 lô hàng để cấp phát");
    }

    // Use TransactionService to create allocation
    const TransactionService = require("./transaction.service").default;

    await TransactionService.createAllocation({
      ...allocation_data,
      warehouse_id: warehouseId,
      created_by_user_id: processedByUserId,
    });

    // Update request status
    return await advisorRequestRepository.update(requestId, {
      status: 1, // Approved
      response_note: response_note || null,
      processed_by_user_id: processedByUserId,
    });
  }

  static async fulfillRecallRequest(
    processedByUserId: number,
    requestId: number,
    warehouseId: number,
    data: {
      transaction_codes?: string[];
      return_date?: string;
      request_ids?: number[];
      import_data?: any; // Keep for backward compatibility
      response_note?: string;
    }
  ): Promise<any> {
    const { transaction_codes, return_date, request_ids = [requestId], response_note, import_data } = data;

    // Backward compatibility: If no transaction_codes are provided, fall back to old importManual logic
    if (!transaction_codes || transaction_codes.length === 0) {
      const request = await advisorRequestRepository.findById(requestId);
      if (!request) {
        throw new NotFoundError("Yêu cầu không tồn tại");
      }

      if (request.status !== 0) {
        throw new BadRequestError("Yêu cầu này đã được xử lý trước đó");
      }

      if (request.type !== 2) {
        throw new BadRequestError("Yêu cầu này không phải là yêu cầu thu hồi");
      }

      if (!import_data || !import_data.items || import_data.items.length === 0) {
        throw new BadRequestError("Vui lòng chọn ít nhất 1 tài sản để nhập kho");
      }

      const TransactionService = require("./transaction.service").default;
      await TransactionService.importManual({
        ...import_data,
        warehouse_id: warehouseId,
        created_by_user_id: processedByUserId,
      });

      return await advisorRequestRepository.update(requestId, {
        status: 1, // Approved
        response_note: response_note || null,
        processed_by_user_id: processedByUserId,
      });
    }

    // New batch recall flow
    if (!return_date) {
      throw new BadRequestError("Vui lòng cung cấp ngày thu hồi");
    }

    const TransactionService = require("./transaction.service").default;
    const db = require("../databases/init.mysql-v2").default;

    // Process return for each transaction code
    for (const code of transaction_codes) {
      const txnDetail = await TransactionService.getTransactionDetail(code);
      if (!txnDetail) {
        throw new NotFoundError(`Không tìm thấy giao dịch cấp phát với mã ${code}`);
      }

      if (txnDetail.warehouse_id !== warehouseId) {
        const originWarehouse = await db("warehouses").where("id", txnDetail.warehouse_id).first();
        const targetWarehouse = await db("warehouses").where("id", warehouseId).first();
        throw new BadRequestError(
          `Đơn cấp phát ${code} thuộc về kho "${originWarehouse?.name || txnDetail.warehouse_id}". Bạn không thể thu hồi về kho "${targetWarehouse?.name || warehouseId}".`
        );
      }

      const items = txnDetail.asset_transaction_items.map((item: any) => ({
        batch_code: item.batch_code,
        status: 1, // Default to GOOD (1)
      }));

      await TransactionService.processReturn({
        items,
        return_date,
        returned_by_user_id: processedByUserId,
        transaction_code: code,
      });
    }

    // Update status of all request IDs in the group
    await db("advisor_requests")
      .whereIn("id", request_ids)
      .update({
        status: 1, // Approved
        response_note: response_note || null,
        processed_by_user_id: processedByUserId,
        updated_at: db.fn.now(),
      });

    return { success: true };
  }

  static async getAllRequests(user: any, params: PaginationRequestsDto): Promise<ResponsePaginationDto<any>> {
    return await advisorRequestRepository.getAll(user, params);
  }

  static async getAdvisorRequests(
    advisorId: number,
    params: PaginationRequestsDto
  ): Promise<ResponsePaginationDto<any>> {
    return await advisorRequestRepository.getByAdvisor(advisorId, params);
  }
}

export default AdvisorRequestService;
