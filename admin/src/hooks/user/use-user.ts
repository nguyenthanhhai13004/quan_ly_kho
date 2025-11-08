import { useQuery } from "@tanstack/react-query";
import UserApi from "../../api/user-api";
export function useUser(userId:number) {
  const query = useQuery({
    queryKey: ["user",userId],
    queryFn: async () => {
      const res = await UserApi.getDetailUser(userId);
      return res.data;
    },
    retry: 1,
    enabled: !!userId
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}