import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MajorApi, { type Major } from "../api/major-api";
import type { PaginationDto } from "../dtos/pagination.dto";

export const useMajors = (params: PaginationDto & { keyword?: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["majors", params],
    queryFn: () => MajorApi.getAll(params),
  });

  return {
    majors: data?.data?.data,
    isLoading,
  };
};

export const useAllMajors = (options?: { enabled?: boolean }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-majors"],
    queryFn: () => MajorApi.getAllList(),
    ...options,
  });

  return {
    majors: data?.data?.data as Major[],
    isLoading,
  };
};

export const useCreateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Major>) => MajorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      queryClient.invalidateQueries({ queryKey: ["all-majors"] });
    },
  });
};

export const useUpdateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Major> }) =>
      MajorApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      queryClient.invalidateQueries({ queryKey: ["all-majors"] });
    },
  });
};

export const useDeleteMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => MajorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
      queryClient.invalidateQueries({ queryKey: ["all-majors"] });
    },
  });
};
