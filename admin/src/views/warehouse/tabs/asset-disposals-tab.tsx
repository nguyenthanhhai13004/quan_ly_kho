import dayjs from "dayjs";
import { TransactionTypeEnum } from "../../../common/enums/transaction-type.enums";
import CustomTable from "../../../components/common/custom-table";
import type { PaginationTransactionsForAssetDto } from "../../../dtos/transaction/pagination-transactions-for-asset";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import { useAllTransactionsForAsset } from "../../../queries/transaction.query";
import type { AssetTabProps } from "./asset-allocations-return-tab";


export default function AssetDisposalsTab({
  assetCode,
}: AssetTabProps) {
  const {filters} = usePaginationParams<PaginationTransactionsForAssetDto>();
  const {transactions} = useAllTransactionsForAsset(filters,assetCode,[TransactionTypeEnum.DISPOSAL])
  const columns = ["STT","Mã giao dịch","Lý do","Ghi chú","Số lượng","Ngày thanh lý","Giá trị thanh lý / 1 tài sản"];
  return <CustomTable columns={columns} data={transactions?.items.map((t,index)=>[
    index+1,
    t.code,
    t.reason,
    t.note,
    t.quantity,
    dayjs(t.disposal_date).format("DD/MM/YYYY"),
    t.cost
  ])||[]} />;
}
