import { useMutation } from "@tanstack/react-query";
import type { CreateAssetDto } from "../../dtos/asset/create-asset.dto";
import AssetApi from "../../api/asset-api";

export function useCreateAsset() {
  return useMutation({
    mutationFn: async ({
      createAssetDto,
    }: {
      createAssetDto: CreateAssetDto;
    }) => {
      return await AssetApi.addNewAsset(createAssetDto);
    }
  });
}
