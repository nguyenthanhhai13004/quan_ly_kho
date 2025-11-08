import { useSearchParams } from "react-router-dom";
import type { PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";

export function useAssetParams(): PaginationAssetsDto {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const name = searchParams.get("name") || "";
  const code = searchParams.get("code") || "";

  const categoryParam = searchParams.get("category_id");
  const statusParam = searchParams.get("status");

  const category_id = categoryParam ? Number(categoryParam) : undefined;
  const status = statusParam ? Number(statusParam) : undefined;

  return {
    page,
    size,
    code,
    name,
    category_id,
    status,
  };
}
