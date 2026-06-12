import api from "../libs/api";
import type { PaginationDto } from "../dtos/pagination.dto";

export interface AdvisorRequest {
  id: number;
  advisor_id: number;
  class_id: number;
  student_id: number | null;
  asset_id: number;
  quantity: number;
  type: number; // 1: Cấp phát, 2: Thu hồi, 3: Báo lỗi, 4: Khác
  status: number; // 0: Chờ duyệt, 1: Đã duyệt, 2: Từ chối
  note: string | null;
  response_note: string | null;
  processed_by_user_id: number | null;
  advisor_name?: string;
  class_name?: string;
  student_name?: string;
  student_code?: string;
  asset_name?: string;
  asset_code?: string;
  processed_by_user_name?: string;
  created_at: string;
  updated_at: string;
}

const AdvisorRequestApi = {
  getMyRequests(params: PaginationDto & { keyword?: string; status?: number; type?: number }) {
    return api.get("/v1/advisor-requests/my-requests", { params });
  },
  create(data: { student_id?: number | null; type: number; note?: string; items: { asset_id: number; quantity: number }[] }) {
    return api.post("/v1/advisor-requests", data);
  },
  getAll(params: PaginationDto & { keyword?: string; status?: number; type?: number; class_id?: number }) {
    return api.get("/v1/advisor-requests/all", { params });
  },
  process(id: number, data: { status: number; response_note?: string }) {
    return api.put(`/v1/advisor-requests/${id}/process`, data);
  },
  fulfillAllocation(id: number, data: { allocation_data: any; response_note?: string }) {
    return api.post(`/v1/advisor-requests/${id}/fulfill-allocation`, data);
  },
  fulfillRecall(id: number, data: { import_data: any; response_note?: string }) {
    return api.post(`/v1/advisor-requests/${id}/fulfill-recall`, data);
  },
};

export default AdvisorRequestApi;

