import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CategoryApi from "../api/category-api";
import type { TCategory } from "../types/category.type";
import type { PaginationDto } from "../common/dtos/pagination.dto";
export function useAllCategories(paginationDto?: PaginationDto & { keyword: string }) {
  const query = useQuery({
    queryKey: ["categories",paginationDto],
    queryFn: async () => {
      const res = await CategoryApi.getAllCategories(paginationDto)
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

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      createCategoryDto,
    }: {
      createCategoryDto: Partial<TCategory>;
      paginationDto?: PaginationDto;
    }) => {
      return await CategoryApi.createCategory(createCategoryDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}


export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      updateCategoryDto,
    }: {
      updateCategoryDto: Partial<TCategory>;
      paginationDto?: PaginationDto;
    }) => {
      return await CategoryApi.updateCategory(updateCategoryDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category_id:number) => {
      return await CategoryApi.deleteCategory(category_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

