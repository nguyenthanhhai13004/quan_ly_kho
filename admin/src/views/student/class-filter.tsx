import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import FilterWrapper from "../filter-wrapper";
import { useAllMajors } from "../../queries/major.query";

type ClassFilterProps = {
  showMajor?: boolean;
};

export default function ClassFilter({ showMajor = false }: ClassFilterProps) {
  const { majors } = useAllMajors({ enabled: showMajor });
  const { filters, handleChange, resetParams, handleSearch } =
    usePaginationParams<PaginationDto & { keyword?: string; major_id?: number }>();

  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      {showMajor && (
        <CustomSelect
          labelType="top"
          label="Hệ đào tạo"
          placeholder="Tất cả hệ"
          className="min-w-[150px] w-full rounded-2xl"
          searchable
          options={
            majors?.map((major) => ({
              label: major.name,
              value: major.id,
            })) || []
          }
          value={filters?.major_id || ""}
          onChange={(e) => handleChange("major_id", e.target.value)}
        />
      )}
      <CustomInput
        className="min-w-[200px] w-full"
        placeholder="Tìm tên lớp, mã lớp..."
        value={filters?.keyword || ""}
        onChange={(e) => handleChange("keyword", e.target.value)}
      />
    </FilterWrapper>
  );
}
