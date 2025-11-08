import { useQuery } from "@tanstack/react-query";
import AuthApi from "../../api/auth-api";
import { getTokens } from "../../utils/storage";

export function useMe() {
  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await AuthApi.me();
      return {
        ...res.data,
        "warehouse_ids":[1,2,3,4,5]
      };
    },
    // staleTime: 5 * 60 * 1000,
    // retry: 1,
    enabled: !!getTokens(),
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
