import api from "../libs/api";
import { getFileName } from "../utils/get-file-name";

class ReportApi {
  static async getReportInventory() {
    const response = await api.get("/v1/reports/inventory");
    return response.data;
  }

  static async getReportAllocation() {
    const response = await api.get("/v1/reports/allocation");
    return response.data;
  }

  static async getReportDisposal() {
    const response = await api.get("/v1/reports/disposal");
    return response.data;
  }

   static async getReportMaintenance() {
    const response = await api.get("/v1/reports/maintenance");
    return response.data;
  }

  static async downloadReportInventoryExcel() {
    const response = await api.get("/v1/reports/inventory/export-excel",{
      responseType: "blob"
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${getFileName("Bao_cao_ton_kho")}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  static async downloadReportAllocationExcel() {
    const response = await api.get("/v1/reports/allocation/export-excel",{
      responseType: "blob"
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${getFileName("bao_cao_cap_phat")}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

   static async downloadReportDisposalExcel() {
    const response = await api.get("/v1/reports/disposal/export-excel",{
      responseType: "blob"
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${getFileName("bao_cao_thanh_ly")}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  static async downloadReportMaintenanceExcel() {
    const response = await api.get("/v1/reports/maintenance/export-excel",{
      responseType: "blob"
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${getFileName("bao_cao_bao_tri")}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}
export default ReportApi;
