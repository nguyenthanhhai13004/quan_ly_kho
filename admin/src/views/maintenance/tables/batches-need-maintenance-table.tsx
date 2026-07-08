import dayjs from "dayjs";
import { useState } from "react";
import CustomTable from "../../../components/common/custom-table";
import { useAllBatchesNeedMaintenance } from "../../../queries/transaction.query";
import CustomCheckbox from "../../../components/common/custom-checkbox";
import { useTransactionStore } from "../../../stores/transactions-store";

const PAGE_SIZE = 10;

export default function BatchesNeedMaintenanceTable() {
  const columns = [
    "Chọn",
    "Mã lô",
    "Mã tài sản",
    "Tên tài sản",
    "Số lượng",
    "Hạn bảo trì",
  ];
  const { batches } = useAllBatchesNeedMaintenance();
  const {
    batchState: { selectedBatches },
    toggleBatch,
  } = useTransactionStore();

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil((batches?.length || 0) / PAGE_SIZE);
  const pagedBatches = batches?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <CustomTable
      title="Danh sách lô tài sản cần bảo trì"
      columns={columns}
      totalPages={totalPages}
      currentPage={page}
      onPageChange={setPage}
      data={
        pagedBatches?.map((b) => [
          <CustomCheckbox
            checked={selectedBatches.some(
              (batch) => batch.batchCode === b?.batch_code,
            )}
            onChange={() => {
              toggleBatch({
                name: b?.asset_name || "",
                batchCode: b?.batch_code,
                quantity: b?.quantity,
              });
            }}
          />,
          b?.batch_code,
          b?.asset_code,
          b?.asset_name,
          b?.quantity,
          b?.maintenance_due
            ? dayjs(b.maintenance_due).format("DD/MM/YYYY")
            : "—",
        ]) || []
      }
    />
  );
}
