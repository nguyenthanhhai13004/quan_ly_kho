import { BsEye } from "react-icons/bs";
import CustomIcon from "../../../components/common/custom-icon";
import CustomTable from "../../../components/common/custom-table";
import { useAllDisposalsTrx } from "../../../queries/transaction.query";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../../dtos/transaction/pagination-transactions.dto";
import AssetTransactionDetailModal from "../../warehouse/modals/asset-transaction-detail-modal";
import { useState } from "react";
import dayjs from "dayjs";
import TransactionFilter from "../../transaction/transaction-filter";
import { calculateTotalCost } from "../../../utils/calculate-total-cost";

type DisposalAssetTableProps = {
  assetCode?: string;
};

export default function DisposalAssetTable({
  assetCode,
}: DisposalAssetTableProps) {
  const { params, setPage } = usePaginationParams<PaginationTransactionsDto>({
    defaultValues: {
      asset_code: assetCode,
    },
  });
  const { transactions } = useAllDisposalsTrx(params);
  const [selected, setSelected] = useState<string | null>(null);
  const columns = [
    "STT",
    "Mã đơn hàng",
    "Tài sản",
    "Người thực hiện",
    "Ngày thanh lý",
    "Giá trị thanh lý",
    "Ghi chú",
    "Hoạt động",
  ];

  return (
    <>
      <CustomTable
        title="D/S lịch sử thanh lý"
        columns={columns}
        filter={<TransactionFilter />}
        currentPage={params.page}
        totalPages={transactions?.totalPages}
        onPageChange={setPage}
        data={
          transactions?.items.map((t, index) => [
            index + 1,
            t.code,
            <div>
              {t.asset_transaction_items.map((asset) => (
                <p key={asset?.asset_code}>
                  <strong>[{asset?.asset_code}]</strong> {asset?.asset_name} -
                  SL: {asset?.quantity}
                </p>
              ))}
            </div>,
            <h5 className="text-[#2b7dbc]">{t?.created_by_user}</h5>,
            dayjs(t.disposal_date).format("DD/MM/YYYY"),
            calculateTotalCost(t.asset_transaction_items),
            <p className="text-gray-500">{t.note}</p>,
            <CustomIcon
              onClick={() => setSelected(t.code)}
              icon={<BsEye size={20} />}
              label="Xem chi tiết"
            />,
          ]) || []
        }
      />
      <AssetTransactionDetailModal
        onClose={() => setSelected(null)}
        open={selected != null}
        transactionCode={selected}
      />
    </>
  );
}
