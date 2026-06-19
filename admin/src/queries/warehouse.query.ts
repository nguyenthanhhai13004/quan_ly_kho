import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import WarehouseApi from "../api/warehouse-api";
import type { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";

export function useAllAssetsInWH(paginationDto:PaginationAssetsDto) {
  const query = useQuery({
    queryKey: ["assets-wh",paginationDto],
    queryFn: async () => {
      const res = await WarehouseApi.getAllAssetsInWarehouseOwn(paginationDto)
      return res.data;
    },
  });

  return {
    assets: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useWarehouseAny(keyword?:string) {
  const query = useQuery({
    queryKey: ["warehouses-any",keyword],
    queryFn: async () => {
      const res = await WarehouseApi.getWarehouseAny(keyword || "");
      return res.data;
    },
  });

  return {
    warehouses: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useWarehouseOwn() {
  const query = useQuery({
    queryKey: ["warehouses-own"],
    queryFn: async () => {
      const res = await WarehouseApi.getWarehouseOwn();
      return res.data;
    },
  });

  return {
    warehouses: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: WarehouseApi.createWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses-any"] });
    }
  });
}

export function useAssetsOwn() {
  const query = useQuery({
    queryKey: ["assets-own"],
    queryFn: async () => {
      const res = await WarehouseApi.getAssetsOwn();
      return res.data;
    },
  });

    return {
    assets: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAllocationOrdersOwn(classId?: string) {
  const query = useQuery({
    queryKey: ["allocation-orders-own", classId],
    queryFn: async () => {
      const res = await WarehouseApi.getAllocationOrdersOwn(classId);
      return res.data;
    },
    enabled: !!classId,
  });

  return {
    orders: query.data as any[] | undefined,
    isLoading: query.isLoading,
  };
}

export function useAssetStock(assetId?: number) {
  const query = useQuery({
    queryKey: ["asset-stock", assetId],
    queryFn: async () => {
      if (!assetId) return [];
      const res = await WarehouseApi.getAssetStockAcrossWarehouses(assetId);
      return res.data;
    },
    enabled: !!assetId,
  });

  return {
    stock: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}