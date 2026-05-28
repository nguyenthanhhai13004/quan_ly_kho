import { useEffect } from "react";
import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import type { PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import { useAllCategories } from "../../queries/category.query";
import FilterWrapper from "../filter-wrapper";
import { statusMap } from "../warehouse/asset-status-badges";

type AssetFilterProps = {
  onFiltersChange?: (newFilters: PaginationAssetsDto) => void;
  inModal?: boolean;
};

export default function AssetFilter({
  onFiltersChange,
  inModal
}: AssetFilterProps) {
  const { categories } = useAllCategories();
  const {
    filters,
    handleChange,
    resetParams,
    handleSearch,
    defaultValues,
    setFilters,
  } = usePaginationParams<PaginationAssetsDto>({
    useUrl: onFiltersChange == undefined,
  });
  const handleReset = () =>{
    if (onFiltersChange){
      onFiltersChange(defaultValues as unknown as PaginationAssetsDto);
      setFilters(defaultValues as unknown as PaginationAssetsDto);
      return;
    }
    resetParams();
  }
  return (
    <FilterWrapper
      onReset={handleReset}
      onSubmit={onFiltersChange ? () => onFiltersChange(filters) : handleSearch}
    >
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
        value={filters?.category_id || ""}
        onChange={(e) => handleChange("category_id", e.target.value)}
        label="Danh mục"
      />

      {
        !inModal && (
          <CustomSelect
        labelType="top"
        placeholder="Tất cả tình trạng"
        className="min-w-[150px]"
        options={
          Object.entries(statusMap).map(([key, value]) => ({
            label: value.label,
            value: key,
          })) || []
        }
        value={filters?.status || ""}
        onChange={(e) => handleChange("status", e.target.value)}
        label="Tình trạng"
      />
        )
      }

      <CustomInput
        placeholder="Tên tài sản"
        value={filters?.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
        className="min-w-[150px]"
      />

      <CustomInput
        placeholder="Mã tài sản"
        value={filters?.code || ""}
        onChange={(e) => handleChange("code", e.target.value)}
        className="min-w-[150px]"
      />
    </FilterWrapper>
  );
}
