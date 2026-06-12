import advisorRequestRepository, { PaginationRequestsDto } from "../repositories/advisor-request.repository";
import userRepository from "../repositories/user.repository";
import { BadRequestError, NotFoundError } from "../cores/error.response";
import { AdvisorRequest } from "../models/advisor-request.model";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import db from "../databases/init.mysql-v2";
import { ADVISOR_REQUESTS_TABLE_NAME } from "../cores/constants/table-name.constant";
import TransactionService from "./transaction.service";

class AdvisorRequestService {
  static async createRequest(
    advisorId: number,
    data: {
      student_id?: number | null;
      type: number; // 1: Cấp phát, 2: Thu hồi, 3: Báo lỗi, 4: Khác
      note?: string;
      items: { asset_id: number; quantity: number }[];
    }
  ): Promise<boolean> {
    // 1. Validate type
    if (![1, 2, 3, 4].includes(data.type)) {
      throw new BadRequestError("Loại yêu cầu không hợp lệ (1: Cấp phát, 2: Thu hồi, 3: Báo lỗi, 4: Khác)");
    }

    if (!data.items || data.items.length === 0) {
      throw new BadRequestError("Danh sách tài sản yêu cầu không được rỗng");
    }

    // Mỗi dòng phải có tài sản hợp lệ và số lượng > 0
    const invalidItem = data.items.find(
      (item) => !item.asset_id || !item.quantity || item.quantity <= 0
    );
    if (invalidItem) {
      throw new BadRequestError("Mỗi tài sản yêu cầu phải có số lượng lớn hơn 0");
    }

    // 2. Get advisor to verify class_id
    const advisor = await userRepository.findUserById(advisorId);
    if (!advisor) {
      throw new NotFoundError("Tài khoản chỉ huy không tồn tại");
    }

    if (!advisor.class_id) {
      throw new BadRequestError("Chỉ huy chưa được gán quản lý lớp học nào");
    }

    // 3. Prepare requests array
    const requestsToStore = data.items.map(item => ({
      advisor_id: advisorId,
      class_id: advisor.class_id as number,
      student_id: data.student_id || null,
      asset_id: item.asset_id,
      quantity: item.quantity,
      type: data.type,
      status: 0, // Pending
      note: data.note || null,
    }));

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
    const { allocation_data, response_note } = data;
    if (!allocation_data || !allocation_data.items || allocation_data.items.length === 0) {
      throw new BadRequestError("Vui lòng chọn ít nhất 1 lô hàng để cấp phát");
    }

    // Gộp tất cả vào MỘT transaction: khóa hàng yêu cầu (FOR UPDATE) để chống
    // duyệt trùng, trừ kho và cập nhật trạng thái cùng nhau (atomic).
    return await db.transaction(async (trx) => {
      const request = await trx(ADVISOR_REQUESTS_TABLE_NAME)
        .where({ id: requestId })
        .forUpdate()
        .first();
      if (!request) {
        throw new NotFoundError("Yêu cầu không tồn tại");
      }
      if (request.status !== 0) {
        throw new BadRequestError("Yêu cầu này đã được xử lý trước đó");
      }
      if (request.type !== 1) {
        throw new BadRequestError("Yêu cầu này không phải là yêu cầu cấp phát");
      }

      // Người nhận phải đúng là chỉ huy đã gửi yêu cầu (chống cấp phát sai chỉ huy)
      if (
        allocation_data.receiver_id === undefined ||
        Number(allocation_data.receiver_id) !== request.advisor_id
      ) {
        throw new BadRequestError(
          "Người nhận phải là chỉ huy đã gửi yêu cầu cấp phát"
        );
      }

      // Cấp phát trong cùng transaction. expected_asset_id / expected_quantity
      // để service kiểm tra lô đúng tài sản và tổng số lượng khớp yêu cầu.
      await TransactionService.createAllocationTx(trx, {
        ...allocation_data,
        warehouse_id: warehouseId,
        created_by_user_id: processedByUserId,
        expected_asset_id: request.asset_id,
        expected_quantity: request.quantity,
      });

      await trx(ADVISOR_REQUESTS_TABLE_NAME)
        .where({ id: requestId })
        .update({
          status: 1, // Approved
          response_note: response_note || null,
          processed_by_user_id: processedByUserId,
          updated_at: trx.fn.now(),
        });

      return await trx(ADVISOR_REQUESTS_TABLE_NAME)
        .where({ id: requestId })
        .first();
    });
  }

  static async fulfillRecallRequest(
    processedByUserId: number,
    requestId: number,
    warehouseId: number,
    data: {
      import_data: any; // ImportManualDto
      response_note?: string;
    }
  ): Promise<AdvisorRequest | null> {
    const { import_data, response_note } = data;
    if (!import_data || !import_data.items || import_data.items.length === 0) {
      throw new BadRequestError("Vui lòng chọn ít nhất 1 tài sản để nhập kho");
    }

    // Gộp tất cả vào MỘT transaction: khóa hàng yêu cầu (FOR UPDATE) để chống
    // duyệt trùng, nhập kho và cập nhật trạng thái cùng nhau (atomic).
    return await db.transaction(async (trx) => {
      const request = await trx(ADVISOR_REQUESTS_TABLE_NAME)
        .where({ id: requestId })
        .forUpdate()
        .first();
      if (!request) {
        throw new NotFoundError("Yêu cầu không tồn tại");
      }
      if (request.status !== 0) {
        throw new BadRequestError("Yêu cầu này đã được xử lý trước đó");
      }
      if (request.type !== 2) {
        throw new BadRequestError("Yêu cầu này không phải là yêu cầu thu hồi");
      }

      // Thu hồi phải đúng tài sản được yêu cầu
      const wrongAsset = import_data.items.find(
        (item: { asset_id: number }) =>
          Number(item.asset_id) !== request.asset_id
      );
      if (wrongAsset) {
        throw new BadRequestError(
          "Tài sản thu hồi không khớp tài sản được yêu cầu"
        );
      }

      // Tổng số lượng thu hồi phải khớp số lượng yêu cầu
      const totalQuantity = import_data.items.reduce(
        (sum: number, item: { quantity: number }) =>
          sum + Number(item.quantity),
        0
      );
      if (totalQuantity !== request.quantity) {
        throw new BadRequestError(
          `Tổng số lượng thu hồi (${totalQuantity}) không khớp số lượng yêu cầu (${request.quantity})`
        );
      }

      // Nhập kho (thu hồi) trong cùng transaction
      await TransactionService.importManualTx(trx, {
        ...import_data,
        warehouse_id: warehouseId,
        created_by_user_id: processedByUserId,
      });

      await trx(ADVISOR_REQUESTS_TABLE_NAME)
        .where({ id: requestId })
        .update({
          status: 1, // Approved
          response_note: response_note || null,
          processed_by_user_id: processedByUserId,
          updated_at: trx.fn.now(),
        });

      return await trx(ADVISOR_REQUESTS_TABLE_NAME)
        .where({ id: requestId })
        .first();
    });
  }

  static async getAllRequests(params: PaginationRequestsDto): Promise<ResponsePaginationDto<any>> {
    return await advisorRequestRepository.getAll(params);
  }

  static async getAdvisorRequests(
    advisorId: number,
    params: PaginationRequestsDto
  ): Promise<ResponsePaginationDto<any>> {
    return await advisorRequestRepository.getByAdvisor(advisorId, params);
  }
}

export default AdvisorRequestService;
