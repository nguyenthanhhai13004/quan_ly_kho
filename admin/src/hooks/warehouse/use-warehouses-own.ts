import { useQuery } from "@tanstack/react-query";
import WarehouseApi from "../../api/warehouse-api";
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
