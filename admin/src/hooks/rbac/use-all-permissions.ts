import { useQuery } from "@tanstack/react-query";
import RbacApi from "../../api/rbac-api";

export function useAllPermissions() {
  const query = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await RbacApi.getAllPermissions();
      return res.data;
    },
    retry: 1,
  });

  return {
    permissions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}