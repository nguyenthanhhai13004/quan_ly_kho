import { useQuery } from "@tanstack/react-query";
import StatsApi from "../api/stats-api";
import { getWarehouseId } from "../utils/storage";

export function useStatsAssetsByCategory() {
  const warehouseId = getWarehouseId();
  const query = useQuery({
    queryKey: ["stats-assets-by-category",warehouseId],
    queryFn: async () => {
      const res = await StatsApi.getStatsAssetsByCategory();
      return res.data;
    },
    enabled: !!warehouseId,
  });
  return {
    dataCategory: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useStatsImportExportWHOwn() {
  const warehouseId = getWarehouseId();
  const query = useQuery({
    queryKey: ["stats-import-export-wh-own",warehouseId],
    queryFn: async () => {
      const res = await StatsApi.getStatsImportExportWHOwn();
      return res.data;
    },
    enabled: !!warehouseId,
  });
  return {
    dataTrend: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useStatsAssetByStatus() {
  const warehouseId = getWarehouseId();
  const query = useQuery({
    queryKey: ["stats-by-status",warehouseId],
    queryFn: async () => {
      const res = await StatsApi.getStatsAssetByStatus();
      return res.data;
    },
    enabled: !!warehouseId,
  });
  return {
    dataStatus: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useStatsAssets() {
  const warehouseId = getWarehouseId();
  const query = useQuery({
    queryKey: ["stats-assets",warehouseId],
    queryFn: async () => {
      const res = await StatsApi.getStatsAsset();
      return res.data;
    },
    enabled: !!warehouseId,
  });
  return {
    assetsTotal: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
