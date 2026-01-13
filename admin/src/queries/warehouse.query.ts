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