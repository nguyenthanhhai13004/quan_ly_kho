import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";

export type PaginationParams = {
  page: number;
  size: number;
};

export function usePaginationParams<T extends Record<string, any> = {}>(
  options?: {
    defaultValues?: Partial<T>;
    useUrl?: boolean;
  }
) {
  const { defaultValues:userDefaultValues, useUrl = true } = options || {};

  const defaultValues: Partial<PaginationParams & T> = {
  ...(userDefaultValues ?? {}),
  page: 1,
  size: 10,
} as unknown as Partial<PaginationParams & T>;

  const [searchParams, setSearchParams] = useUrl ? useSearchParams() : [new URLSearchParams(), () => {}];

  const params = useMemo(() => {
    const page = useUrl ? Number(searchParams.get("page") || 1) : 1;
    const size = useUrl ? Number(searchParams.get("size") || 10) : 10;
    const customParams = useUrl
      ? (Object.fromEntries(searchParams.entries()) as T)
      : {};
    return {
      page,
      size,
      ...defaultValues,
      ...customParams,
    } as PaginationParams & T;
  }, [searchParams, defaultValues, useUrl]);

  const [filters, setFilters] = useState<T>(params);

  const handleChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setParams = useCallback(
    (newParams: Partial<PaginationParams & T>) => {
      if (useUrl) {
        const updated = new URLSearchParams(searchParams);
        Object.entries(newParams).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") {
            updated.delete(key);
          } else {
            updated.set(key, String(value));
          }
        });
        setSearchParams(updated);
      }
      setFilters((prev) => ({ ...prev, ...newParams } as T));
    },
    [searchParams, setSearchParams, useUrl]
  );

  const removeParam = useCallback(
    (key: keyof (PaginationParams & T)) => {
      if (useUrl) {
        const updated = new URLSearchParams(searchParams);
        updated.delete(String(key));
        setSearchParams(updated);
      }
      setFilters((prev) => {
        const copy = { ...prev };
        delete copy[key as keyof T];
        return copy;
      });
    },
    [searchParams, setSearchParams, useUrl]
  );

  const setPage = useCallback(
    (page: number) => setParams({ ...params, page }),
    [params, setParams]
  );

  const setPageFilter = useCallback(
    (page: number) => setFilters({ ...params, page }),
    [filters, setFilters]
  );

  const handleSearch = useCallback(() => {
    setParams({ page: params.page, size: params.size, ...filters });
  }, [filters, params.page, params.size, setParams]);

  const resetParams = useCallback(() => {
    if (useUrl) {
      const updated = new URLSearchParams();
      if (defaultValues) {
        Object.entries(defaultValues).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            updated.set(key, String(value));
          }
        });
      }
      setSearchParams(updated);
    }
    setFilters((defaultValues ?? {}) as unknown as T);
  }, [defaultValues, setSearchParams, useUrl]);

  return {
    params,
    filters,
    setFilters,
    handleChange,
    setParams,
    removeParam,
    setPage,
    resetParams,
    handleSearch,
    defaultValues,
    setPageFilter
  };
}

