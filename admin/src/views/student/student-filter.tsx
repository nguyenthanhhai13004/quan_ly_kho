import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useAllClasses } from "../../queries/class.query";
import FilterWrapper from "../filter-wrapper";

export default function StudentFilter() {
  const { classes } = useAllClasses();
  const { filters, handleChange, resetParams, handleSearch } =
    usePaginationParams<PaginationDto & { keyword?: string; class_id?: number; active?: number }>();

  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        className="min-w-[150px] w-full rounded-2xl"
        searchable
        options={
          classes?.map((c) => ({
            label: c.name,
            value: String(c.id),
          })) || []
        }
        value={filters?.class_id || ""}
        onChange={(e) => handleChange("class_id", e.target.value)}
        label="Lớp học"
      />
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        className="min-w-[150px] w-full rounded-2xl"
        customDropdown
        options={[
          { label: "Đang hoạt động", value: "1" },
          { label: "Không hoạt động", value: "0" },
        ]}
        label="Trạng thái"
        value={filters?.active !== undefined && filters?.active !== null ? String(filters.active) : ""}
        onChange={(e) => handleChange("active", e.target.value)}
      />
      <CustomInput
        className="min-w-[200px] w-full"
        placeholder="Tìm theo tên, mã hoặc email..."
        value={filters?.keyword || ""}
        onChange={(e) => handleChange("keyword", e.target.value)}
      />
    </FilterWrapper>
  );
}
