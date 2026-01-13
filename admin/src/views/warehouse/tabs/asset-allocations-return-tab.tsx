import dayjs from "dayjs";
import { TransactionTypeEnum } from "../../../common/enums/transaction-type.enums";
import CustomTable from "../../../components/common/custom-table";
import type { PaginationTransactionsForAssetDto } from "../../../dtos/transaction/pagination-transactions-for-asset";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import { useAllTransactionsForAsset } from "../../../queries/transaction.query";

export type AssetTabProps = {
  assetCode: string;
};
export default function AssetAllocationsReturnTab({
  assetCode,
}: AssetTabProps) {
  const {filters} = usePaginationParams<PaginationTransactionsForAssetDto>();
  const {transactions} = useAllTransactionsForAsset(filters,assetCode,[TransactionTypeEnum.ALLOCATION_RETURN])
  const columns = ["STT","Mã giao dịch","Lý do","Ghi chú","Số lượng","Ngày cấp phát","Hạn thu hồi","Ngày thu hồi"];
  return <CustomTable columns={columns} data={transactions?.items.map((t,index)=>[
    index+1,
    t.code,
    t.reason,
    t.note,
    t.quantity,
    dayjs(t.allocation_date).format("DD/MM/YYYY"),
    t?.return_deadline ? dayjs(t.return_deadline).format("DD/MM/YYYY") : "Không thu hồi",
    t?.return_date ? dayjs(t.return_date).format("DD/MM/YYYY") : "",
  ])||[]} />;
}
