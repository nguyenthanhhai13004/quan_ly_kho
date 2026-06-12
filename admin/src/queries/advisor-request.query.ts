import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdvisorRequestApi from "../api/advisor-request-api";
import type { PaginationDto } from "../dtos/pagination.dto";

export const useMyAdvisorRequests = (params: PaginationDto & { keyword?: string; status?: number; type?: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-advisor-requests", params],
    queryFn: () => AdvisorRequestApi.getMyRequests(params),
  });

  return {
    requests: data?.data?.data,
    isLoading,
  };
};

export const useAllAdvisorRequests = (params: PaginationDto & { keyword?: string; status?: number; type?: number; class_id?: number }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["all-advisor-requests", params],
    queryFn: () => AdvisorRequestApi.getAll(params),
  });

  return {
    requests: data?.data?.data,
    isLoading,
  };
};

export const useCreateAdvisorRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { student_id?: number | null; type: number; note?: string; items: { asset_id: number; quantity: number }[] }) =>
      AdvisorRequestApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-advisor-requests"] });
    },
  });
};

export const useProcessAdvisorRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status: number; response_note?: string } }) =>
      AdvisorRequestApi.process(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-advisor-requests"] });
    },
  });
};

export const useFulfillAllocationRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { allocation_data: any; response_note?: string };
    }) => AdvisorRequestApi.fulfillAllocation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-advisor-requests"] });
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
    },
  });
};

export const useFulfillRecallRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { import_data: any; response_note?: string };
    }) => AdvisorRequestApi.fulfillRecall(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-advisor-requests"] });
      queryClient.invalidateQueries({ queryKey: ["assets-wh"] });
    },
  });
};
