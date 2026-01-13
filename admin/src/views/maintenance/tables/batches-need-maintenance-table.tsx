import dayjs from "dayjs";
import CustomTable from "../../../components/common/custom-table";
import { useAllBatchesNeedMaintenance } from "../../../queries/transaction.query";
import CustomCheckbox from "../../../components/common/custom-checkbox";
import { useTransactionStore } from "../../../stores/transactions-store";

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
  return (
    <CustomTable
      title="Danh sách lô tài sản cần bảo trì"
      columns={columns}
      data={
        batches?.map((b) => [
          <CustomCheckbox
            disabled={b.quantity == 0}
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
          dayjs(b?.maintenance_due).format("DD/MM/YYYY"),
        ]) || []
      }
    />
  );
}
