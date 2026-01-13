import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { useUsers } from "../../queries/user.query";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../dtos/transaction/pagination-transactions.dto";
import FilterWrapper from "../filter-wrapper";

type TransactionFilterProps = {
  onFiltersChange?: (newFilters: PaginationTransactionsDto) => void;
};

export default function TransactionFilter({
  onFiltersChange,
}: TransactionFilterProps) {
  const { users } = useUsers();
  const {
    handleChange,
    filters,
    handleSearch,
    resetParams,
    defaultValues,
    setFilters,
  } = usePaginationParams<PaginationTransactionsDto>({
    useUrl: onFiltersChange == undefined,
  });
  const handleReset = () => {
    if (onFiltersChange) {
      onFiltersChange(defaultValues as unknown as PaginationTransactionsDto);
      setFilters(defaultValues as unknown as PaginationTransactionsDto);
      return;
    }
    resetParams();
  };
  return (
    <FilterWrapper
      onReset={handleReset}
      onSubmit={onFiltersChange ? () => onFiltersChange(filters) : handleSearch}
    >
      <CustomInput
        onChange={(e) => handleChange("from_date", e.target.value)}
        type="date"
        value={filters?.from_date || ""}
        label="Từ ngày"
        labelType="top"
      />
      <CustomInput
        onChange={(e) => handleChange("to_date", e.target.value)}
        type="date"
        value={filters?.to_date || ""}
        label="Đến ngày"
        labelType="top"
      />
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        value={filters?.created_by_user_id || ""}
        className="min-w-[150px] rounded-2xl"
        options={
          users?.items.map((u) => {
            return {
              label: u.fullname,
              value: u.id,
            };
          }) || []
        }
        label="Người thực hiện"
        onChange={(e) => handleChange("created_by_user_id", e.target.value)}
      />
      <CustomInput
        placeholder="Mã đơn hàng"
        value={filters?.code || ""}
        onChange={(e) => handleChange("code", e.target.value)}
        className="min-w-[150px]"
      />
    </FilterWrapper>
  );
}
