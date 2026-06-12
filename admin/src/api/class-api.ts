import type { PaginationDto } from "../dtos/pagination.dto";
import api from "../libs/api";

export interface Class {
  id: number;
  major_id: number;
  name: string;
  code: string;
  description?: string;
  major_name?: string;
  created_at: string;
  updated_at: string;
}

const ClassApi = {
  getAll(params: PaginationDto & { keyword?: string; major_id?: number }) {
    return api.get("/v1/classes", { params });
  },
  getAllList(major_id?: number) {
    return api.get("/v1/classes/all", { params: { major_id } });
  },
  getById(id: number) {
    return api.get(`/v1/classes/${id}`);
  },
  create(data: Partial<Class>) {
    return api.post("/v1/classes", data);
  },
  update(id: number, data: Partial<Class>) {
    return api.put(`/v1/classes/${id}`, data);
  },
  delete(id: number) {
    return api.delete(`/v1/classes/${id}`);
  },
};

export default ClassApi;
