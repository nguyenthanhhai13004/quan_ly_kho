import { BsEye } from "react-icons/bs";
import {
  TransactionTypeEnum,
  TransactionTypeText,
} from "../../common/enums/transaction-type.enums";
import CustomIcon from "../../components/common/custom-icon";
import CustomTable from "../../components/common/custom-table";
import { useModalProvider } from "../../providers/modal-provider";
import AssetTransactionDetailModal from "../warehouse/modals/asset-transaction-detail-modal";
import {
  useAllImportExportTrx,
  useAllTransactions,
} from "../../queries/transaction.query";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../dtos/transaction/pagination-transactions.dto";

import dayjs from "dayjs";
import TransactionHistoryFilter from "./transaction-history-filter";

export default function TransactionsHistoryTable() {
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
  const { openModal } = useModalProvider();
  const { params, setPage } = usePaginationParams<PaginationTransactionsDto>();
  const { transactions } = useAllTransactions(params);

  return (
    <>
      <CustomTable
        // title="D/S"
        filter={<TransactionHistoryFilter />}
        columns={columns}
        currentPage={params.page}
        totalPages={transactions?.totalPages}
        onPageChange={setPage}
        data={
          transactions?.items.map((t, index: number) => [
            index + 1,
            t.code,
            TransactionTypeText[t.type],
            <div>
              {Object.entries(
                t.asset_transaction_items.reduce(
                  (acc, asset) => {
                    if (!acc[asset.asset_code]) {
                      acc[asset.asset_code] = {
                        asset_code: asset.asset_code,
                        asset_name: asset.asset_name,
                        quantity: 0,
                      };
                    }
                    acc[asset.asset_code].quantity += asset.quantity;
                    return acc;
                  },
                  {} as Record<
                    string,
                    { asset_code: string; asset_name: string; quantity: number }
                  >,
                ),
              ).map(([_, asset]) => (
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
              onClick={() => {
                openModal(AssetTransactionDetailModal, { transactionCode: t.code });
              }}
              icon={<BsEye size={20} />}
              label="Xem chi tiết"
            />,
          ]) || []
        }
      />

    </>
  );
}
