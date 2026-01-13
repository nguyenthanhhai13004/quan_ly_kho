import { useMutation, useQuery } from "@tanstack/react-query";
import ReportApi from "../api/report-api";

export function useReportInventory() {
  const query = useQuery({
    queryKey: ["report-inventory"],
    queryFn: async () => {
      const res = await ReportApi.getReportInventory();
      return res;
    },
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useReportAllocation() {
  const query = useQuery({
    queryKey: ["report-allocation"],
    queryFn: async () => {
      const res = await ReportApi.getReportAllocation();
      return res;
    },
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useReportDisposal() {
  const query = useQuery({
    queryKey: ["report-disposal"],
    queryFn: async () => {
      const res = await ReportApi.getReportDisposal();
      return res;
    },
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useReportMaintenance() {
  const query = useQuery({
    queryKey: ["report-maintenance"],
    queryFn: async () => {
      const res = await ReportApi.getReportMaintenance();
      return res;
    },
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}


export function useDownloadInventoryReport() {
  return useMutation({
    mutationFn: async () => {
      return await ReportApi.downloadReportInventoryExcel();
    },
  });
}

export function useDownloadAllocationReport() {
  return useMutation({
    mutationFn: async () => {
      return await ReportApi.downloadReportAllocationExcel();
    },
  });
}


export function useDownloadMaintenanceReport() {
  return useMutation({
    mutationFn: async () => {
      return await ReportApi.downloadReportMaintenanceExcel();
    },
  });
}


export function useDownloadDisposalReport() {
  return useMutation({
    mutationFn: async () => {
      return await ReportApi.downloadReportDisposalExcel();
    },
  });
}
