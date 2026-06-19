import { MaintenanceStatusEnum } from "../../../common/enums/maintenance-status";
import { TransactionTypeEnum } from "../../../common/enums/transaction-type.enums";
import CustomTable from "../../../components/common/custom-table";
import CustomBadge from "../../../components/common/custom-badge";
import type { PaginationTransactionsForAssetDto } from "../../../dtos/transaction/pagination-transactions-for-asset";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import { useAllTransactionsForAsset } from "../../../queries/transaction.query";
import type { AssetTabProps } from "./asset-allocations-return-tab";

export default function AssetMainentanceTab({
  assetCode,
}: AssetTabProps) {
  const { filters } = usePaginationParams<PaginationTransactionsForAssetDto>();
  const { transactions } = useAllTransactionsForAsset(filters, assetCode, [
    TransactionTypeEnum.MAINTENANCE,
  ]);
  const columns = [
    "STT",
    "Mã giao dịch",
    "Lý do",
    "Ghi chú",
    "Số lượng",
    "Trạng thái bảo trì",
  ];
  return (
    <CustomTable
      columns={columns}
      data={
        transactions?.items.map((t, index) => [
          index + 1,
          t.code,
          t.reason,
          t.note,
          t.quantity,
          <CustomBadge
            label={
              t?.maintenance_status === MaintenanceStatusEnum.IN_PROGRESS
                ? "Đang bảo trì"
                : "Hoàn thành bảo trì"
            }
            status={t?.maintenance_status === 0 ? "warning" : "success"}
          />,
        ]) || []
      }
    />
  );
}
