import { useQuery } from "@tanstack/react-query";
import RbacApi from "../../api/rbac-api";

export function useAllRoles() {
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await RbacApi.getAllRoles();
      return res.data;
    },
    retry: 1,
  });

  return {
    roles: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}