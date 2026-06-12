import { IBaseModelAttributes } from "../cores/base.model";

export interface AdvisorRequest extends IBaseModelAttributes {
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
}
