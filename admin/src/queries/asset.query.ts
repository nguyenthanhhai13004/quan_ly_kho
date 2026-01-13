import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AssetApi from "../api/asset-api";
import type { PaginationAssetsDto } from "../dtos/asset/pagination-assets.dto";
import type { CreateAssetDto } from "../dtos/asset/create-asset.dto";
import type { UpdateAssetDto } from "../dtos/asset/update-asset.dto";
export function useAllAssets(paginationDto?: PaginationAssetsDto) {
  const query = useQuery({
    queryKey: ["assets", paginationDto],
    queryFn: async () => {
      const res = await AssetApi.getAllAssets(paginationDto || {});
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

export function useCreateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      createAssetDto,
    }: {
      createAssetDto: CreateAssetDto;
      paginationDto?: PaginationAssetsDto;
    }) => {
      return await AssetApi.addNewAsset(createAssetDto);
    },
    onSuccess: ({ data }, variables) => {
      const { paginationDto } = variables;
      queryClient.setQueryData(
        ["assets", { ...paginationDto, page: 1 }],
        (oldData: any) => {
          if (!oldData) return;
          return {
            ...oldData,
            items: [data, ...oldData?.items],
          };
        },
      );
    },
  });
}

export function useDetailAsset(assetCode: string | null) {
  const query = useQuery({
    queryKey: ["asset", assetCode],
    queryFn: async () => {
      if (!assetCode) return;
      const res = await AssetApi.getDetailAsset(assetCode);
      return res.data;
    },
    retry: 1,
    enabled: !!assetCode,
  });

  return {
    asset: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      assetId,
      updateAssetDto,
    }: {
      assetId: number;
      updateAssetDto: UpdateAssetDto;
      paginationDto?: PaginationAssetsDto;
    }) => {
      return await AssetApi.updateAsset(assetId, updateAssetDto);
    },
    onSuccess: ({ data }, variables) => {
      const { paginationDto } = variables;
      queryClient.setQueryData(["assets", paginationDto], (oldData: any) => {
        if (!oldData) return;
        return {
          ...oldData,
          items: oldData.items?.map((asset: any) =>
            asset.id === data.id ? { ...asset, ...data } : asset,
          ),
        };
      });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ assetId }: { assetId: number }) => {
      return await AssetApi.deleteAsset(assetId);
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
    onError: (error: any) => {
      console.error(error.response?.data || error.message);
    },
  });
}

export function useGenerateCode() {
  return useMutation({
    mutationFn: async (category_id: number) => {
      return await AssetApi.generateCode(category_id);
    },
  });
}
