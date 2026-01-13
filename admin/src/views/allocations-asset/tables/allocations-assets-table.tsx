import { BsEye } from "react-icons/bs";
import CustomIcon from "../../../components/common/custom-icon";
import CustomTable from "../../../components/common/custom-table";
import CustomBadge from "../../../components/common/custom-badge";
import { useModalProvider } from "../../../providers/modal-provider";
import { ModalEnum } from "../../../constants/modals.constant";
import { MdRecycling } from "react-icons/md";
import { useAllAllocationReturnTrx } from "../../../queries/transaction.query";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../../dtos/transaction/pagination-transactions.dto";
import AssetReturnsModal from "../modals/asset-returns-modal";
import { useState } from "react";
import AssetTransactionDetailModal from "../../warehouse/modals/asset-transaction-detail-modal";
import dayjs from "dayjs";
import TransactionFilter from "../../transaction/transaction-filter";

const columns = [
  "STT",
  "Hoạt động",
  "Mã cấp phát",
  "Tài sản",
  "Người thực hiện",
  "Hạn thu hồi",
  "Trạng thái thu hồi",
  "Ngày thu hồi",
  "Ngày cấp",
  "Ghi chú",
];
type AllocationsAssetTableProps = {
  assetCode?: string;
};
export default function AllocationsAssetTable({
  assetCode,
}: AllocationsAssetTableProps) {
  const { currentModal, setCurrentModal, closeModal } = useModalProvider();
  const { params, setPage } = usePaginationParams<PaginationTransactionsDto>({
    defaultValues: {
      asset_code: assetCode
    },
  });
  const { transactions } = useAllAllocationReturnTrx(params);
  const [selected, setSelected] = useState<string | null>(null);
  function renderReturnStatus({
    return_date,
    return_deadline,
  }: {
    return_date: string | null;
    return_deadline: string | null;
  }) {
    if (return_date) {
      return <CustomBadge label="Đã thu hồi" status="success" />;
    }

    if (return_deadline) {
      const isNotExpired = new Date(return_deadline) >= new Date();

      return isNotExpired ? (
        <CustomBadge label="Chưa thu hồi" status="info" />
      ) : (
        <CustomBadge label="Quá hạn thu hồi" status="error" />
      );
    }

    return <CustomBadge label="Không yêu cầu" status="default" />;
  }
  return (
    <>
      <CustomTable
        columns={columns}
        filter={<TransactionFilter />}
        currentPage={params.page}
        totalPages={transactions?.totalPages}
        onPageChange={setPage}
        data={
          transactions?.items.map((t, index: number) => [
            index + 1,
            <div>
              <CustomIcon
                onClick={() => {
                  setSelected(t.code);
                  setCurrentModal(ModalEnum.ALLOCATIONS_ASSETS_DETAIL_MODAL);
                }}
                icon={<BsEye size={20} />}
                label="Xem chi tiết"
              />
              ,
              <CustomIcon
                disabled={!t.return_deadline || t.return_date !== null}
                icon={<MdRecycling size={20} />}
                label="Thu hồi"
                onClick={() => {
                  setSelected(t.code);
                  setCurrentModal(ModalEnum.RETURNS_ASSETS_MODAL);
                }}
                variant="danger"
              />
            </div>,
            t.code,
            <div>
              {t.asset_transaction_items.map((asset) => (
                <p>
                  <strong>[{asset.asset_code}]</strong> {asset.asset_name} - SL
                  : {asset.quantity}
                </p>
              ))}
            </div>,
            <h5 className="text-[#2b7dbc]">{t.created_by_user}</h5>,
            t.return_deadline
              ? dayjs(t.return_deadline).format("DD/MM/YYYY")
              : "Không thu hồi",
            renderReturnStatus({
              return_date: t.return_date,
              return_deadline: t.return_deadline,
            }),
            t?.return_date ? dayjs(t.return_date).format("DD/MM/YYYY") : "",
            dayjs(t.allocation_date).format("DD/MM/YYYY"),
            <p className="text-gray-500">{t.note}</p>,
          ]) || []
        }
      />
      <AssetTransactionDetailModal
        onClose={() => {
          closeModal();
          setSelected(null);
        }}
        open={currentModal === ModalEnum.ALLOCATIONS_ASSETS_DETAIL_MODAL}
        transactionCode={selected}
      />
      <AssetReturnsModal
        transactionCode={selected}
        onClose={() => {
          closeModal();
          setSelected(null);
        }}
        open={currentModal === ModalEnum.RETURNS_ASSETS_MODAL}
      />
    </>
  );
}
