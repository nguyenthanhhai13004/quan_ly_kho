import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import AssetTransactionFilter from "./asset-transaction-filter";
import { BsEye } from "react-icons/bs";

import { useAllTransactions } from "../../queries/transaction.query";
import { useModalProvider } from "../../providers/modal-provider";
import AssetTransactionDetailModal from "./modals/asset-transaction-detail-modal";

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
  const { transactions } = useAllTransactions({ type: "3,4" } as any);
  return (
    <>
      <CustomTable
        title="D/S"
        filter={<AssetTransactionFilter />}
        columns={columns}
        data={transactions?.items.map((t, index: number) => [
          index + 1,
          t.code,
          t.type,
          <div>
            {t.asset_transaction_items.map((asset) => (
              <p key={asset.asset_code}>
                <strong>[{asset.asset_code}]</strong> {asset.asset_name} - SL:{" "}
                {asset.quantity}
              </p>
            ))}
          </div>,
          <h5 className="text-[#2b7dbc]">{t.created_by_user}</h5>,
          t.created_at,
          <p className="text-gray-500">{t.note}</p>,
          <CustomIcon
            onClick={() => openModal(AssetTransactionDetailModal, { transactionCode: "1" })}
            icon={<BsEye size={20} />}
            label="Xem chi tiết"
          />,
        ])|| []}
      />

    </>
  );
}
