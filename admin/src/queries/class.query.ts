import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClassApi, { type Class } from "../api/class-api";
import type { PaginationDto } from "../dtos/pagination.dto";

export const useClasses = (params: PaginationDto & { keyword?: string; major_id?: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["classes", params],
    queryFn: () => ClassApi.getAll(params),
  });

  return {
    classes: data?.data?.data,
    isLoading,
  };
};

export const useAllClasses = (major_id?: number, options?: any) => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-classes", major_id],
    queryFn: () => ClassApi.getAllList(major_id),
    ...options,
  });

  return {
    classes: (data as any)?.data?.data as Class[],
    isLoading,
  };
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Class>) => ClassApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["all-classes"] });
    },
  });
};

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Class> }) =>
      ClassApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["all-classes"] });
    },
  });
};

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ClassApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["all-classes"] });
    },
  });
};
