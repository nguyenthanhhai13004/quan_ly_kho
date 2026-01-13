import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import type { ResponsePaginationDto } from "../common/dtos/response-pagination.dto";
import type { AssetReturnData } from "../dtos/transaction/asset-return.dto";
import type { CreateAllocationData } from "../dtos/transaction/create-allocation.dto";
import type { CreateDisposalData } from "../dtos/transaction/create-disposal.dto";
import type { CreateMaintenanceData } from "../dtos/transaction/create-maintenance.dto";
import type { ExportExcelFileData } from "../dtos/transaction/export-excel.dto";
import type { ExportManualData } from "../dtos/transaction/export-manual.dto";
import type { ImportExcelFileData } from "../dtos/transaction/import-excel.dto";
import type { ImportManualData } from "../dtos/transaction/import-manual.dto";
import type { PaginationTransactionsForAssetDto } from "../dtos/transaction/pagination-transactions-for-asset";
import type { PaginationTransactionsDto } from "../dtos/transaction/pagination-transactions.dto";
import type { UpdateMaintenaceData } from "../dtos/transaction/update-maintenance.dto";
import api from "../libs/api";
import type { TAssetTransaction, TBatch, TTransactionItemAsset } from "../types/transaction.type";
import qs from "qs";

class TransactionApi {
  static async getTransactions(
    paginationTrxDto: PaginationTransactionsDto,
  ): Promise<ApiResponseDto<ResponsePaginationDto<TAssetTransaction>>> {
    const queryString = qs.stringify(paginationTrxDto, {
      arrayFormat: "repeat",
    });
    const response = await api.get(`/v1/transactions?${queryString}`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async importManualTransaction(importManualData: ImportManualData) {
    const response = await api.post(
      `/v1/transactions/import-manual`,
      importManualData,
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async importExcelTransaction(importExcelData: ImportExcelFileData) {
    const { file, name, received_date, sender_location, note, reason,code } =
      importExcelData;
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (name) formData.append("name", name);
    if (received_date) formData.append("received_date", received_date);
    if (sender_location) formData.append("sender_location", sender_location);
    if (note) formData.append("note", note);
    if (reason) formData.append("reason", reason);
    if (code) formData.append("code", code);
    const response = await api.post(`/v1/transactions/import-excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async exportExcelTransaction(exportExcelData: ExportExcelFileData) {
    const {
      file,
      name,
      note,
      reason,
      export_date,
      receiver_address,
      receiver_name,
      receiver_phone,
      code
    } = exportExcelData;
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (name) formData.append("name", name);
    if (export_date) formData.append("export_date", export_date);
    if (receiver_address) formData.append("receiver_address", receiver_address);
    if (receiver_name) formData.append("receiver_name", receiver_name);
    if (receiver_phone) formData.append("receiver_phone", receiver_phone);
    if (code) formData.append("code", code);
    if (note) formData.append("note", note);
    if (reason) formData.append("reason", reason);
    const response = await api.post(`/v1/transactions/export-excel`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async exportManualTransaction(exportManualData: ExportManualData) {
    const response = await api.post(
      `/v1/transactions/export-manual`,
      exportManualData,
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async createDisposalTransaction(
    createDisposalData: CreateDisposalData,
  ) {
    const response = await api.post(
      `/v1/transactions/disposals`,
      createDisposalData,
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async createAllocationTransaction(
    createAllocationData: CreateAllocationData,
  ) {
    const response = await api.post(
      `/v1/transactions/allocations`,
      createAllocationData,
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async createMaintenanceTransaction(
    createMaintenanceData: CreateMaintenanceData,
  ) {
    const response = await api.post(
      `/v1/transactions/maintenances`,
      createMaintenanceData,
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async processReturnAssets(
    transactionCode: string,
    data: AssetReturnData,
  ) {
    const response = await api.post(
      `/v1/transactions/returns/${transactionCode}`,
      data,
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }


  static async updateMaintenance(
    transactionCode: string,
    data: UpdateMaintenaceData,
  ) {
    const response = await api.put(
      `/v1/transactions/maintenances/${transactionCode}`,
      data,
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }
  static async validationImportExcel(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/v1/transactions/validate-import",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async validationExportExcel(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/v1/transactions/validate-export",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getDetailBatch(batchCode: string) {
    const response = await api.get(`/v1/warehouse-asset/batch/${batchCode}`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getAssetBatches(
    assetCode: string,
  ): Promise<ApiResponseDto<TBatch[]>> {
    const response = await api.get(`/v1/warehouse-asset/${assetCode}/batches`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

   static async getAllBatchesNeedMaintenace(
  ): Promise<ApiResponseDto<TBatch[]>> {
    const response = await api.get(`/v1/warehouses/batches/need-maintenance`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getDetailTransaction(code: string) {
    const response = await api.get(`/v1/transactions/${code}`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getTransactionsForAsset(
    paginationTrxDto: PaginationTransactionsForAssetDto,
    assetCode:string
  ): Promise<ApiResponseDto<ResponsePaginationDto<TTransactionItemAsset>>> {
    const queryString = qs.stringify(paginationTrxDto, {
      arrayFormat: "repeat",
    });
    const response = await api.get(`/v1/transactions/asset/${assetCode}?${queryString}`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }
}

export default TransactionApi;
