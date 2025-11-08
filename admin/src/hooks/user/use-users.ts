import { useQuery } from "@tanstack/react-query";
import UserApi from "../../api/user-api";
import type { PaginationUsersDto } from "../../dtos/user/pagination-users.dto";

export function useUsers(paginationDto?: PaginationUsersDto) {
  const query = useQuery({
    queryKey: ["users",paginationDto],
    queryFn: async () => {
      const res = await UserApi.getAllUsers(paginationDto || {});
      return res.data;
    },
    retry: 1,
  });

  return {
    users: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}