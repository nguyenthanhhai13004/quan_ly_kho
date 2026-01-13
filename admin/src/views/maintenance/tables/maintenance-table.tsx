import { BsEye } from "react-icons/bs";
import CustomIcon from "../../../components/common/custom-icon";
import CustomTable from "../../../components/common/custom-table";
import CustomBadge from "../../../components/common/custom-badge";
import { useAllMaintenancesTrx } from "../../../queries/transaction.query";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import type { PaginationTransactionsDto } from "../../../dtos/transaction/pagination-transactions.dto";
import { calculateTotalCost } from "../../../utils/calculate-total-cost";
import AssetTransactionDetailModal from "../../warehouse/modals/asset-transaction-detail-modal";
import { ModalEnum, type ModalEnumType } from "../../../constants/modals.constant";
import { useModalProvider } from "../../../providers/modal-provider";
import { useState } from "react";
import { TbPhoneDone } from "react-icons/tb";
import UpdateMaintenanceModal from "../modals/update-maintenance-modal";
import { MaintenanceStatusEnum } from "../../../common/enums/maintenance-status";
import TransactionFilter from "../../transaction/transaction-filter";

type MaintenanceTableProps = {
  assetCode?: string;
  isInModal?:boolean
};

export default function MaintenanceTable({ assetCode,isInModal}: MaintenanceTableProps) {
  const columns = [
    "STT",
    "Hoạt động",
    "Mã đơn hàng",
    "Tài sản",
    "Người thực hiện",
    "Ngày bảo trì",
    "Tổng chi phí",
    "Trạng thái",
  ];
  const { params,setFilters,filters } = usePaginationParams<PaginationTransactionsDto>({
    defaultValues: {
      asset_code: assetCode
    },
    useUrl:!isInModal
  });
  const { transactions } = useAllMaintenancesTrx(isInModal ? filters : params);
  const { currentModal, setCurrentModal, closeModal } = useModalProvider();
  const [selected, setSelected] = useState<string | null>(null);
   const [modal, setModal] = useState<ModalEnumType>(ModalEnum.CLOSE_MODAL);
  return (
    <>
      <CustomTable
        title="D/S"
        columns={columns}
        filter={<TransactionFilter onFiltersChange={isInModal ? setFilters : undefined}/>}
        data={
          transactions?.items.map((t, index: number) => [
            index + 1,
            <>
              <CustomIcon
                onClick={() => {
                  setSelected(t.code);
                  setModal(ModalEnum.TRANSACTION_DETAIL_MODAL);
                }}
                icon={<BsEye size={20} />}
                label="Xem chi tiết"
              />
              <CustomIcon
                onClick={() => {
                  setSelected(t.code);
                  setCurrentModal(ModalEnum.MAINTENANCE_UPDATE_MODAL);
                }}
                disabled={
                  t?.maintenance_status === MaintenanceStatusEnum.COMPLETED
                }
                variant="success"
                icon={<TbPhoneDone size={20} />}
                label="Ghi nhận hoàn thành"
              />
            </>,
            t.code,
            <div>
              {t.asset_transaction_items.map((asset) => (
                <p key={asset.asset_code}>
                  <strong>[{asset.asset_name}]</strong> {asset.asset_name} - SL:{" "}
                  {asset.quantity}
                </p>
              ))}
            </div>,
            <h5 className="text-[#2b7dbc]">{t.created_by_user}</h5>,
            t.created_at,
            <p className="text-gray-500">
              {calculateTotalCost(t.asset_transaction_items)}
            </p>,
            <CustomBadge
              label={
                t?.maintenance_status === MaintenanceStatusEnum.IN_PROGRESS
                  ? "Đang bảo trì"
                  : "Hoàn thành bảo trì"
              }
              status={t?.maintenance_status === 0 ? "warning" : "success"}
            />,
          ]) || []
        }
      />

      <AssetTransactionDetailModal
        onClose={() => {
          setSelected(null);
          setModal(ModalEnum.CLOSE_MODAL);
        }}
        open={modal == ModalEnum.TRANSACTION_DETAIL_MODAL}
        transactionCode={selected}
      />
      <UpdateMaintenanceModal
        onClose={() => {
          closeModal();
          setSelected(null);
        }}
        open={currentModal == ModalEnum.MAINTENANCE_UPDATE_MODAL}
        transactionCode={selected}
      />
    </>
  );
}
