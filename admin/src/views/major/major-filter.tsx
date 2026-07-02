import CustomInput from "../../components/common/custom-input";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import FilterWrapper from "../filter-wrapper";

export default function MajorFilter() {
  const { filters, handleChange, resetParams, handleSearch } =
    usePaginationParams<PaginationDto & { keyword?: string }>();

  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      <CustomInput
        className="min-w-[200px] w-full"
        placeholder="Tìm tên hệ, mã hệ..."
        value={filters?.keyword || ""}
        onChange={(e) => handleChange("keyword", e.target.value)}
      />
    </FilterWrapper>
  );
}
