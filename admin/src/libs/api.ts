import axios from "axios";
import { getTokens, getWarehouseId, removeTokens, removeWarehouseId } from "../utils/storage";
import { toast } from "react-toastify";

const api = axios.create({
  withCredentials: true,
  baseURL: `${import.meta.env.VITE_API_URL}`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const tokens = getTokens();
  const warehouse_id = getWarehouseId();
  console.log("aa",warehouse_id)
  if (tokens) {
    config.headers.Authorization = `${tokens.access_token}`;
  }
  if (warehouse_id) {
    config.headers['x-warehouse-id'] = `${warehouse_id}`;
  }
  return config;
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const message = error.response?.data?.message;
    if (message) {
      if (message === "expired") {
        removeTokens();
        removeWarehouseId();
        window.location.href = "/login";
      } else {
        toast.error(message, {
          progress: undefined,
          hideProgressBar: true,
          autoClose: 1000,
        });
      }
    }
    return Promise.reject(error);
  },
);

export default api;
