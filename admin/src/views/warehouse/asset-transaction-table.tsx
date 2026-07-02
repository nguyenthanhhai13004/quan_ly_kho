import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import AssetTransactionFilter from "./asset-transaction-filter";
import { BsEye } from "react-icons/bs";

import { useAllTransactions } from "../../queries/transaction.query";
import { useModalProvider } from "../../providers/modal-provider";
import AssetTransactionDetailModal from "./modals/asset-transaction-detail-modal";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../dtos/transaction/pagination-transactions.dto";
import {
  TransactionTypeEnum,
  TransactionTypeText,
} from "../../common/enums/transaction-type.enums";
import dayjs from "dayjs";

const columns = [
  "STT",
  "Mã đơn hàng",
  "Loại",
  "Tài sản",
  "Người thực hiện",
  "Ngày giờ",
  "Ghi chú",
  "Hoạt động",
];

export default function AssetTransactionTable() {
  const { openModal } = useModalProvider();
  const { params, setPage } = usePaginationParams<PaginationTransactionsDto>({
    defaultValues: {
      types: [TransactionTypeEnum.IMPORT, TransactionTypeEnum.EXPORT],
    },
  });
  const { transactions } = useAllTransactions(params);
  return (
    <>
      <CustomTable
        // title="D/S"
        filter={<AssetTransactionFilter />}
        columns={columns}
        currentPage={params.page}
        totalPages={transactions?.totalPages}
        onPageChange={setPage}
        data={transactions?.items.map((t, index: number) => [
          index + 1 + (params.page - 1) * params.size,
          t.code,
          TransactionTypeText[t.type],
          <div>
            {t.asset_transaction_items.map((asset) => (
              <p key={asset.asset_code}>
                <strong>[{asset.asset_code}]</strong> {asset.asset_name} - SL:{" "}
                {asset.quantity}
              </p>
            ))}
          </div>,
          <h5 className="text-[#2b7dbc]">{t.created_by_user}</h5>,
          dayjs(t.created_at).format("HH:mm DD/MM/YYYY"),
          <p className="text-gray-500">{t.note}</p>,
          <CustomIcon
            onClick={() => openModal(AssetTransactionDetailModal, { transactionCode: t.code })}
            icon={<BsEye size={20} />}
            label="Xem chi tiết"
          />,
        ])|| []}
      />

    </>
  );
}
