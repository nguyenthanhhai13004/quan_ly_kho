import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { useUsers } from "../../queries/user.query";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../dtos/transaction/pagination-transactions.dto";
import FilterWrapper from "../filter-wrapper";
import { TransactionTypeEnum } from "../../common/enums/transaction-type.enums";

const transactionTypes = [
  {
    label: "Nhập",
    value: TransactionTypeEnum.IMPORT,
  },
  {
    label: "Xuất",
    value: TransactionTypeEnum.EXPORT,
  },
];

export default function AssetTransactionFilter() {
  const { users } = useUsers({ page: 1, size: 100 });
  const { handleChange, filters, handleSearch, resetParams } =
    usePaginationParams<PaginationTransactionsDto>();

  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      <CustomSelect
        placeholder="Tất cả"
        labelType="top"
        className="min-w-[150px] rounded-2xl"
        customDropdown
        options={transactionTypes}
        value={filters?.types?.[0] || ""}
        onChange={(e) => {
          if (e.target.value) {
            handleChange("types", e.target.value);
          } else {
            handleChange(
              "types",
              `${TransactionTypeEnum.IMPORT},${TransactionTypeEnum.EXPORT}`,
            );
          }
        }}
        label="Loại giao dịch"
      />
      <CustomInput
        type="date"
        label="Từ ngày"
        labelType="top"
        value={filters?.from_date || ""}
        onChange={(e) => handleChange("from_date", e.target.value)}
      />
      <CustomInput
        type="date"
        label="Đến ngày"
        labelType="top"
        value={filters?.to_date || ""}
        onChange={(e) => handleChange("to_date", e.target.value)}
      />
      <CustomSelect
        labelType="top"
        placeholder="Tất cả"
        className="min-w-[150px] rounded-2xl"
        searchable
        options={
          users?.items.map((u) => ({
            label: u.fullname,
            value: u.id,
          })) || []
        }
        label="Người thực hiện"
        value={filters?.created_by_user_id || ""}
        onChange={(e) => handleChange("created_by_user_id", e.target.value)}
      />
      <CustomInput
        placeholder="Mã đơn hàng"
        value={filters?.code || ""}
        onChange={(e) => handleChange("code", e.target.value)}
      />
    </FilterWrapper>
  );
}
