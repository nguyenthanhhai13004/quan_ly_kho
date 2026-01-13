import {useQuery } from "@tanstack/react-query";
import AdministrativeApi from "../api/administrative-api";


export function useAllProvinces() {
  const query = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await AdministrativeApi.getAllProvinces()
      return res.data;
    },
    retry: 1,
  });

  return {
    provinces: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}


export function useAllWardsByProvince(provinceCode: string) {
  const query = useQuery({
    queryKey: ["wards", provinceCode],
    queryFn: async () => {
      const res = await AdministrativeApi.getAllWardByProvince(provinceCode)
      return res.data;
    },
    retry: 1,
    enabled: !!provinceCode,
  });

  return {
    wards: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useNominatimSearch(q: string) {
  const query = useQuery({
    queryKey: ["nominatimSearch", q],
    queryFn: async () => {
      const res = await AdministrativeApi.getNominatimSearch(q)
      return res;
    },
    retry: 1,
    enabled: !!q,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}



