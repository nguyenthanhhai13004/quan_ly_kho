import { useQuery } from "@tanstack/react-query";
import type { PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";
import AssetApi from "../../api/asset-api";
export function useAllAssets(paginationDto?: PaginationAssetsDto) {
  const query = useQuery({
    queryKey: ["assets",paginationDto],
    queryFn: async () => {
      const res = await AssetApi.getAllAssets(paginationDto||{})
      return res.data;
    },
    retry: 1,
  });

  return {
    assets: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}