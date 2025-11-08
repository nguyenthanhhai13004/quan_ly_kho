import { useSearchParams } from "react-router-dom";

export function useUserParams() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const keyword = searchParams.get("keyword") || "";
  const active = searchParams.get("active");
  const role = searchParams.get("role") || "";
  const drawer = searchParams.get("drawer") || "";
  return { page, size, role ,keyword,active,drawer};
}