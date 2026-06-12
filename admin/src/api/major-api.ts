import type { PaginationDto } from "../dtos/pagination.dto";
import api from "../libs/api";

export interface Major {
  id: number;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const MajorApi = {
  getAll(params: PaginationDto & { keyword?: string }) {
    return api.get("/v1/majors", { params });
  },
  getAllList() {
    return api.get("/v1/majors/all");
  },
  getById(id: number) {
    return api.get(`/v1/majors/${id}`);
  },
  create(data: Partial<Major>) {
    return api.post("/v1/majors", data);
  },
  update(id: number, data: Partial<Major>) {
    return api.put(`/v1/majors/${id}`, data);
  },
  delete(id: number) {
    return api.delete(`/v1/majors/${id}`);
  },
};

export default MajorApi;
