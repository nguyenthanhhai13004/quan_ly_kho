import type { PaginationDto } from "../../common/dtos/pagination.dto";
import CustomInput from "../../components/common/custom-input";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import FilterWrapper from "../filter-wrapper";

export default function CategoryFilter() {
  const {
    filters,
    handleChange,
    resetParams,
    handleSearch,
  } = usePaginationParams<PaginationDto & { keyword: string }>({});
  return (
    <FilterWrapper onReset={resetParams} onSubmit={handleSearch}>
      <CustomInput
        placeholder="Danh mục A .."
        value={filters?.keyword || ""}
        onChange={(e) => handleChange("keyword", e.target.value)}
        className="min-w-[150px]"
      />
    </FilterWrapper>
  );
}
