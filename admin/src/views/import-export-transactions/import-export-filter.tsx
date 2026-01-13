import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import { useUsers } from "../../queries/user.query";
import { TransactionTypeEnum } from "../../common/enums/transaction-type.enums";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../dtos/transaction/pagination-transactions.dto";
import FilterWrapper from "../filter-wrapper";
export default function ImportExportFilter() {
  const { users } = useUsers();
  const { handleChange, filters, handleSearch, resetParams } =
    usePaginationParams<PaginationTransactionsDto>();
  return (
    <FilterWrapper onSubmit={handleSearch} onReset={resetParams}>
      <CustomSelect
        placeholder="Tất cả"
        labelType="top"
        className="min-w-[150px] rounded-2xl"
        options={[
          {
            label: "Xuất",
            value: TransactionTypeEnum.EXPORT,
          },
          {
            label: "Nhập",
            value: TransactionTypeEnum.IMPORT,
          },
        ]}
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
        value={filters?.types?.[0] || ""}
        label="Loại giao dịch"
      />
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
      />
    </FilterWrapper>
  );
}
