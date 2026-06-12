import type { PaginationDto } from "../dtos/pagination.dto";
import api from "../libs/api";

export interface Student {
  id: number;
  class_id: number;
  student_code: string;
  fullname: string;
  email: string;
  phone_number?: string;
  is_active: boolean;
  class_name?: string;
  created_at: string;
  updated_at: string;
}

const StudentApi = {
  getAll(params: PaginationDto & { keyword?: string; class_id?: number; active?: number }) {
    return api.get("/v1/students", { params });
  },
  getById(id: number) {
    return api.get(`/v1/students/${id}`);
  },
  create(data: Partial<Student>) {
    return api.post("/v1/students", data);
  },
  update(id: number, data: Partial<Student>) {
    return api.put(`/v1/students/${id}`, data);
  },
  resetPassword(id: number) {
    return api.put(`/v1/students/${id}/reset-password`);
  },
  delete(id: number) {
    return api.delete(`/v1/students/${id}`);
  },
};

export default StudentApi;
