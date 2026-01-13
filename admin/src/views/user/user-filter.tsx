import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationUsersDto } from "../../dtos/user/pagination-users.dto";
import { useAllRoles } from "../../queries/rbac.query";
import FilterWrapper from "../filter-wrapper";

export default function UserFilter() {
  const { roles } = useAllRoles();
  const {filters, handleChange, resetParams,handleSearch} =
    usePaginationParams<PaginationUsersDto>();
  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        className="min-w-[150px] w-full rounded-2xl"
        options={
          roles?.map((role) => {
            return {
              label: role.name,
              value: String(role.id),
            };
          }) || []
        }
        value={filters?.role || ""}
        onChange={(e) => handleChange("role", e.target.value)}
        label="Loại"
      />
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        className="min-w-[150px] w-full rounded-2xl"
        options={[
          { label: "Active", value: "1" },
          { label: "Inactive", value: "0" },
        ]}
        label="Trạng thái"
        value={filters?.active || ""}
        onChange={(e) => handleChange("active", e.target.value)}
      />
      <CustomInput
        className="min-w-[200px] w-full"
        placeholder="Tìm theo tên hoặc email..."
        value={filters?.keyword || ""}
        onChange={(e) => handleChange("keyword", e.target.value)}
      />
    </FilterWrapper>
  );
}
