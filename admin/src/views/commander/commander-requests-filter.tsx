import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import FilterWrapper from "../filter-wrapper";

export default function CommanderRequestsFilter() {
  const { filters, handleChange, resetParams, handleSearch } =
    usePaginationParams<{ keyword?: string; status?: string; type?: string }>();

  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      <CustomSelect
        labelType="top"
        placeholder="Tất cả loại"
        className="min-w-[150px] w-full rounded-2xl"
        customDropdown
        options={[
          { label: "Cấp phát", value: "1" },
          { label: "Thu hồi", value: "2" },
          { label: "Báo lỗi", value: "3" },
          { label: "Khác", value: "4" },
        ]}
        value={filters?.type || ""}
        onChange={(e) => handleChange("type", e.target.value)}
        label="Loại"
      />
      <CustomSelect
        labelType="top"
        placeholder="Tất cả trạng thái"
        className="min-w-[150px] w-full rounded-2xl"
        customDropdown
        options={[
          { label: "Chờ duyệt", value: "0" },
          { label: "Đã duyệt", value: "1" },
          { label: "Từ chối", value: "2" },
        ]}
        label="Trạng thái"
        value={filters?.status || ""}
        onChange={(e) => handleChange("status", e.target.value)}
      />
      <CustomInput
        className="min-w-[200px] w-full"
        placeholder="Tìm theo tên học viên, mã học viên hoặc tên tài sản..."
        value={filters?.keyword || ""}
        onChange={(e) => handleChange("keyword", e.target.value)}
      />
    </FilterWrapper>
  );
}
