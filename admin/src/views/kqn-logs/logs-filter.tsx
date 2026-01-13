import CustomInput from "../../components/common/custom-input";
import { type PaginationLogsDto } from "../../dtos/log/pagination-logs.dto";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import FilterWrapper from "../filter-wrapper";

export default function LogsFilter() {
  const {handleChange, handleSearch, resetParams, filters } =
    usePaginationParams<PaginationLogsDto>();
  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      <CustomInput
        className="min-w-[200px] w-full"
        label="Từ ngày"
        type="date"
        labelType="top"
        value={filters?.startDate || ""}
        onChange={(e) => handleChange("startDate", e.target.value)}
      />
      <CustomInput
        className="min-w-[200px] w-full"
        label="Đến ngày"
        type="date"
        labelType="top"
        value={filters?.endDate || ""}
        onChange={(e) => handleChange("endDate", e.target.value)}
      />
      <CustomInput
        className="min-w-[200px] w-full"
        label="Username"
        labelType="top"
        value={filters?.username || ""}
        onChange={(e) => handleChange("username", e.target.value)}
      />

      {/* <CustomInput
        className="min-w-[200px] w-full"
        label="Controller"
        labelType="top"
        onChange={(e) => handleChange("keyword", e.target.value)}
      />

      <CustomInput
        className="min-w-[200px] w-full"
        label="Action"
        labelType="top"
        onChange={(e) => handleChange("keyword", e.target.value)}
      /> */}
    </FilterWrapper>
  );
}
