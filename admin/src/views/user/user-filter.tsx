import { IoIosSearch } from "react-icons/io";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { useAllRoles } from "../../hooks/rbac/use-all-roles";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useUserParams } from "../../hooks/user/use-user-params";

export default function UserFilter() {
  const { roles } = useAllRoles();
  const [searchParams, setSearchParams] = useSearchParams();
  const {keyword,role,active} = useUserParams();
  const [filters, setFilters] = useState({
    role,
    active:active || "",
    keyword,
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params: any = {};
    if (filters.role) params.role = filters.role;
    if (filters.active) params.active = filters.active;
    if (filters.keyword) params.keyword = filters.keyword;
    params.page = "1";
    setSearchParams(params);
  };
  return (
    <>
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
        value={filters.role}
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
        value={filters.active}
        onChange={(e) => handleChange("active", e.target.value)}
      />
      <CustomInput
        className="min-w-[200px] w-full"
        placeholder="Tìm theo tên hoặc email..."
        value={filters.keyword}
        onChange={(e) => handleChange("keyword", e.target.value)}
      />
      <CustomButton
        label="Tìm kiếm"
        className="h-full"
        onClick={handleSearch}
        icon={<IoIosSearch size={20} />}
      />
    </>
  );
}
