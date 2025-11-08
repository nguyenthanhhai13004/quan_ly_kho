import { useQuery } from "@tanstack/react-query";
import type { PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";
import CategoryApi from "../../api/category-api";
export function useAllCategories(paginationDto?: PaginationAssetsDto) {
  const query = useQuery({
    queryKey: ["categories",paginationDto],
    queryFn: async () => {
      const res = await CategoryApi.getAllCategories({})
      return res.data;
    },
    retry: 1,
  });

  return {
    categories: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}