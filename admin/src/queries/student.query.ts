import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StudentApi, { type Student } from "../api/student-api";
import type { PaginationDto } from "../dtos/pagination.dto";

export const useStudents = (params: PaginationDto & { keyword?: string; class_id?: number; active?: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["students", params],
    queryFn: () => StudentApi.getAll(params),
  });

  return {
    students: data?.data?.data,
    isLoading,
  };
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Student>) => StudentApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Student> }) =>
      StudentApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useResetPasswordStudent = () => {
  return useMutation({
    mutationFn: (id: number) => StudentApi.resetPassword(id),
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => StudentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
