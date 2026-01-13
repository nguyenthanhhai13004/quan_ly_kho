import { BsEye } from "react-icons/bs";
import { TransactionTypeEnum } from "../../common/enums/transaction-type.enums";
import CustomIcon from "../../components/common/custom-icon";
import CustomTable from "../../components/common/custom-table";
import { ModalEnum } from "../../constants/modals.constant";
import { useModalProvider } from "../../providers/modal-provider";
import AssetTransactionDetailModal from "../warehouse/modals/asset-transaction-detail-modal";
import { useAllImportExportTrx } from "../../queries/transaction.query";
import ImportExportFilter from "./import-export-filter";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../dtos/transaction/pagination-transactions.dto";
import { useState } from "react";
import dayjs from "dayjs";

export default function ImportExportTransactionsTable() {
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
  const { currentModal, setCurrentModal } = useModalProvider();
  const { params, setPage } = usePaginationParams<PaginationTransactionsDto>();
  const { transactions } = useAllImportExportTrx(params);
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <CustomTable
        title="D/S"
        filter={<ImportExportFilter />}
        columns={columns}
        currentPage={params.page}
        totalPages={transactions?.totalPages}
        onPageChange={setPage}
        data={
          transactions?.items.map((t, index: number) => [
            index + 1,
            t.code,
            t.type === TransactionTypeEnum.IMPORT ? "Nhập kho" : "Xuất kho",
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
            dayjs(t.created_at).format("DD/MM/YYYY HH:mm"),
            <p className="text-gray-500">{t.note}</p>,
            <CustomIcon
              onClick={() => {
                setSelected(t.code);
                setCurrentModal(ModalEnum.ASSET_TRANSACTION_DETAIL);
              }}
              icon={<BsEye size={20} />}
              label="Xem chi tiết"
            />,
          ]) || []
        }
      />
      <AssetTransactionDetailModal
        transactionCode={selected}
        onClose={() => {
          setCurrentModal(ModalEnum.CLOSE_MODAL);
        }}
        open={currentModal === ModalEnum.ASSET_TRANSACTION_DETAIL}
      />
    </>
  );
}
