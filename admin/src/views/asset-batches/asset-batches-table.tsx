import dayjs from "dayjs";
import CustomBadge from "../../components/common/custom-badge";
import CustomCheckbox from "../../components/common/custom-checkbox";
import CustomTable from "../../components/common/custom-table";
import { useAllBatchesByCode } from "../../queries/transaction.query";
import { useTransactionStore } from "../../stores/transactions-store";
import { getAssetBadgeProps } from "../../utils/get-asset-badge-props";


export default function AssetBatchesTable({
  assetCode,
  assetName
}: {
  assetCode: string;
  assetName?:string;
}) {
  const columns = [
    "Chọn",
    "Mã lô",
    "Số lượng",
    "Tình trạng",
    "Ngày sản xuất",
    "Hạn sử dụng",
    "Hạn bảo trì"
  ];
  const { batches } = useAllBatchesByCode(assetCode);
  const {toggleBatch,batchState:{selectedBatches},addRowImport} = useTransactionStore();
  return (
    <CustomTable
      columns={columns}
      data={
        batches?.map((batch) => [
          <CustomCheckbox
            disabled={batch.quantity == 0}
            checked={selectedBatches.some((b) => b.batchCode === batch.batch_code)}
            onChange={() =>{
              toggleBatch({
                name: assetName,
                batchCode: batch.batch_code,
                quantity: batch.quantity,
              })
              addRowImport(batch)
            }}
          />,
          batch.batch_code,
          batch.quantity,
          <CustomBadge
          {
            ...getAssetBadgeProps(batch.status)
          }
          />,
           dayjs(batch.manufacture_date).isValid()
                ? dayjs(batch.manufacture_date).format("DD/MM/YYYY")
                : "N/A",
              dayjs(batch.expiration_date).isValid()
                ? dayjs(batch.expiration_date).format("DD/MM/YYYY")
                : "N/A",
              dayjs(batch.maintenance_due).isValid()
                ? dayjs(batch.maintenance_due).format("DD/MM/YYYY")
                : "N/A",
        ]) || []
      }
    />
  );
}
