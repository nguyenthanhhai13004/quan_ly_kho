import { IoIosSearch } from "react-icons/io";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ASSET_STATUS } from "../../constants/asset-status.constant";
import { useAllCategories } from "../../hooks/category/use-all-assets";
import { useAssetParams } from "../../hooks/asset/use-asset-params";
import type { PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";

export default function AssetFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useAllCategories();
  const { page, category_id, code, name, status, size } = useAssetParams();
  const [filters, setFilters] = useState<PaginationAssetsDto>({
    page,
    size,
    category_id,
    code,
    name,
    status,
  });

  const handleChange = (
    key: keyof PaginationAssetsDto,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    const params: Record<string, string> = {};
    if (filters?.category_id != null)
      params.category_id = String(filters.category_id);
    if (filters?.status != null) params.status = String(filters.status);
    if (filters.name) params.name = filters.name;
    if (filters.code) params.code = filters.code;
    params.page = "1";
    params.size = String(filters.size || 10);
    setSearchParams(params);
  };
  return (
    <>
      <CustomSelect
        labelType="top"
        placeholder="Tất cả danh mục"
        className="min-w-[150px]"
        options={
          categories?.items?.map((c) => ({
            label: c.name,
            value: c.id,
          })) || []
        }
        value={filters.category_id}
        onChange={(e) => handleChange("category_id", e.target.value)}
        label="Danh mục"
      />

      <CustomSelect
        labelType="top"
        placeholder="Tất cả tình trạng"
        className="min-w-[150px]"
        options={ASSET_STATUS}
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
        label="Tình trạng"
      />

      <CustomInput
        placeholder="Tên tài sản"
        value={filters.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <CustomInput
        placeholder="Mã tài sản"
        value={filters.code || ""}
        onChange={(e) => handleChange("code", e.target.value)}
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
