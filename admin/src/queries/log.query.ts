import {useQuery } from "@tanstack/react-query";
import LogApi from "../api/log-api";
import type { PaginationLogsDto } from "../dtos/log/pagination-logs.dto";
export function useAllLogs(paginationDto: PaginationLogsDto) {
  const query = useQuery({
    queryKey: ["logs",paginationDto],
    queryFn: async () => {
      const res = await LogApi.getAllLogs(paginationDto)
      return res.data;
    },
    retry: 1,
  });

  return {
    logs: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
