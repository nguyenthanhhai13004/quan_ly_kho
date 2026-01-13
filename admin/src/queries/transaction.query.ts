import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ImportManualData } from "../dtos/transaction/import-manual.dto";
import TransactionApi from "../api/transactions-api";
import { toast } from "react-toastify";
import type { ImportExcelFileData } from "../dtos/transaction/import-excel.dto";
import type { ExportExcelFileData } from "../dtos/transaction/export-excel.dto";
import type { PaginationTransactionsDto } from "../dtos/transaction/pagination-transactions.dto";
import type { ExportManualData } from "../dtos/transaction/export-manual.dto";
import type { CreateDisposalData } from "../dtos/transaction/create-disposal.dto";
import { TransactionTypeEnum } from "../common/enums/transaction-type.enums";
import type { CreateAllocationData } from "../dtos/transaction/create-allocation.dto";
import type { AssetReturnData } from "../dtos/transaction/asset-return.dto";
import type { CreateMaintenanceData } from "../dtos/transaction/create-maintenance.dto";
import type { UpdateMaintenaceData } from "../dtos/transaction/update-maintenance.dto";
import type { PaginationTransactionsForAssetDto } from "../dtos/transaction/pagination-transactions-for-asset";

export function useImportManualTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      importManualData,
    }: {
      importManualData: ImportManualData;
    }) => {
      return await TransactionApi.importManualTransaction(importManualData);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useImportExcelTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      importExcelFileData,
    }: {
      importExcelFileData: ImportExcelFileData;
    }) => {
      return await TransactionApi.importExcelTransaction(importExcelFileData);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useExportExcelTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      exportExcelFileData,
    }: {
      exportExcelFileData: ExportExcelFileData;
    }) => {
      return await TransactionApi.exportExcelTransaction(exportExcelFileData);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useExportManualTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      exportManualData,
    }: {
      exportManualData: ExportManualData;
    }) => {
      return await TransactionApi.exportManualTransaction(exportManualData);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useCreateDisposalTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      createDisposalData,
    }: {
      createDisposalData: CreateDisposalData;
    }) => {
      return await TransactionApi.createDisposalTransaction(createDisposalData);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["disposals"] });
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useCreateAllocationsTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: CreateAllocationData }) => {
      return await TransactionApi.createAllocationTransaction(data);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["allocations-returns"] });
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useCreateMaintenanceTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: CreateMaintenanceData }) => {
      return await TransactionApi.createMaintenanceTransaction(data);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
      queryClient.invalidateQueries({ queryKey: ["batches-need-maintenance"] });//batches-need-maintenance
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useReturnAssets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      transactionCode,
    }: {
      data: AssetReturnData;
      transactionCode: string;
    }) => {
      return await TransactionApi.processReturnAssets(transactionCode, data);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["allocations-returns"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      data,
      transactionCode,
    }: {
      data: UpdateMaintenaceData;
      transactionCode: string;
    }) => {
      return await TransactionApi.updateMaintenance(transactionCode, data);
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["maintenances"] });
      toast.info(message, {
        progress: undefined,
        hideProgressBar: true,
        autoClose: 1000,
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useAllDisposalsTrx(
  paginationTrxDto: PaginationTransactionsDto,
) {
  const query = useQuery({
    queryKey: ["disposals", paginationTrxDto],
    queryFn: async () => {
      const res = await TransactionApi.getTransactions({
        ...paginationTrxDto,
        types: [TransactionTypeEnum.DISPOSAL],
      });
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllAllocationReturnTrx(
  paginationTrxDto: PaginationTransactionsDto,
) {
  const query = useQuery({
    queryKey: ["allocations-returns", paginationTrxDto],
    queryFn: async () => {
      const res = await TransactionApi.getTransactions({
        ...paginationTrxDto,
        types: [TransactionTypeEnum.ALLOCATION_RETURN],
      });
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllMaintenancesTrx(
  paginationTrxDto: PaginationTransactionsDto,
) {
  const query = useQuery({
    queryKey: ["maintenances", paginationTrxDto],
    queryFn: async () => {
      const res = await TransactionApi.getTransactions({
        ...paginationTrxDto,
        types: [TransactionTypeEnum.MAINTENANCE],
      });
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllImportExportTrx(
  paginationTrxDto: PaginationTransactionsDto,
) {
  const query = useQuery({
    queryKey: ["import-export", paginationTrxDto],
    queryFn: async () => {
      const res = await TransactionApi.getTransactions({
        ...paginationTrxDto,
        types: [TransactionTypeEnum.IMPORT,TransactionTypeEnum.EXPORT],
      });
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllTransactions(
  paginationTrxDto: PaginationTransactionsDto,
) {
  const query = useQuery({
    queryKey: ["transactions", paginationTrxDto],
    queryFn: async () => {
      const res = await TransactionApi.getTransactions(paginationTrxDto);
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllTransactionsForAsset(
  paginationTrxDto: PaginationTransactionsForAssetDto,
  assetCode:string,
  types:number[]
) {
  const query = useQuery({
    queryKey: ["transactions",types,assetCode,paginationTrxDto],
    queryFn: async () => {
      const res = await TransactionApi.getTransactionsForAsset({
        ...paginationTrxDto,
        types
      },assetCode)
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useDetailTransaction(transactionCode: string) {
  const query = useQuery({
    queryKey: ["transaction", transactionCode],
    queryFn: async () => {
      const res = await TransactionApi.getDetailTransaction(transactionCode);
      return res.data;
    },
  });

  return {
    transaction: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllBatchesByCode(assetCode?: string|null) {
  const query = useQuery({
    queryKey: [assetCode, "batches"],
    queryFn: async () => {
      if (!assetCode)return;
      const res = await TransactionApi.getAssetBatches(assetCode);
      return res.data;
    },
  });
  return {
    batches: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllBatchesNeedMaintenance() {
  const query = useQuery({
    queryKey: ["batches-need-maintenance"],
    queryFn: async () => {
      const res = await TransactionApi.getAllBatchesNeedMaintenace();
      return res.data;
    },
  });
  return {
    batches: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
