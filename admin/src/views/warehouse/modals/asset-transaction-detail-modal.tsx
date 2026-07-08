import dayjs from "dayjs";
import { MaintenanceStatusEnum } from "../../../common/enums/maintenance-status";
import { TransactionTypeEnum } from "../../../common/enums/transaction-type.enums";
import CustomBadge from "../../../components/common/custom-badge";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import CustomTextarea from "../../../components/common/custom-textarea";
import { useDetailTransaction } from "../../../queries/transaction.query";
import { getAssetBadgeProps } from "../../../utils/get-asset-badge-props";
import AssetInTransactionTable from "./asset-in-transaction-table";

interface AssetTransactionDetailModalProps extends CustomModalProps {
  transactionCode: string | null;
}
export default function AssetTransactionDetailModal({
  transactionCode,
  onClose,
  open,
}: AssetTransactionDetailModalProps) {
  const { transaction } = useDetailTransaction(transactionCode);

  if (!transactionCode) return null;

  return (
    <CustomModal
      title={`Chi tiết giao dịch`}
      width="max-w-4xl"
      onClose={onClose}
      open={open}
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="overflow-auto bg-gray-200 p-4 pt-5 rounded-2xl">
          <AssetInTransactionTable
            showStatus={
              transaction?.return_date &&
              transaction?.type == TransactionTypeEnum.ALLOCATION_RETURN || (transaction?.type  == TransactionTypeEnum.MAINTENANCE && transaction?.maintenance_status == MaintenanceStatusEnum.COMPLETED)
            }
            showCost={
              transaction?.type == TransactionTypeEnum.MAINTENANCE
            }
            renderStatus={(s) => (
              <CustomBadge {...getAssetBadgeProps(s)} className="text-xs" />
            )}
            assets={transaction?.asset_transaction_items || []}
          />
        </div>
        <div className="flex flex-col gap-5 pt-5 bg-gray-200 p-4 rounded-2xl">
           <CustomInput
            value={transaction?.code}
            disabled
            label="Mã đơn hàng"
            labelType="top"
          />

          <CustomInput
            value={transaction?.name}
            disabled
            label="Tên đơn hàng"
            labelType="top"
          />

          {transaction?.type == TransactionTypeEnum.EXPORT && (
            <>
              <CustomInput
                value={
                  transaction?.export_date
                    ? dayjs(transaction.export_date).format("YYYY-MM-DD")
                    : ""
                }
                disabled
                type="date"
                label="Ngày xuất"
                labelType="top"
              />
              <CustomInput
                disabled
                label="Tên Người/ Đơn vị nhận"
                labelType="top"
                value={transaction?.receiver_name}
              />
              <CustomInput
                value={transaction?.receiver_phone}
                disabled
                label="Số điện thoại"
                labelType="top"
              />
              <CustomTextarea
                value={transaction?.receiver_address}
                disabled
                label="Địa chỉ"
                labelType="top"
              />
            </>
          )}

          {transaction?.type == TransactionTypeEnum.IMPORT && (
            <>
              <CustomInput
                value={
                  transaction?.received_date
                    ? dayjs(transaction.received_date).format("YYYY-MM-DD")
                    : ""
                }
                disabled
                type="date"
                label="Ngày nhận"
                labelType="top"
              />
              <CustomInput
                disabled
                label="Nơi gửi"
                labelType="top"
                value={transaction?.sender_location}
              />
            </>
          )}

          {transaction?.type == TransactionTypeEnum.DISPOSAL && (
            <>
              <CustomInput
                value={
                  transaction?.disposal_date
                    ? dayjs(transaction.disposal_date).format("YYYY-MM-DD")
                    : ""
                }
                disabled
                type="date"
                label="Ngày thanh lý"
                labelType="top"
              />
            </>
          )}

          {transaction?.type == TransactionTypeEnum.ALLOCATION_RETURN && (
            <>
              <CustomInput
                value={
                  transaction?.allocation_date
                    ? dayjs(transaction.allocation_date).format("YYYY-MM-DD")
                    : ""
                }
                disabled
                type="date"
                label="Ngày cấp phát"
                labelType="top"
              />
              <CustomInput
                value={
                  transaction?.return_deadline
                    ? dayjs(transaction.return_deadline).format("YYYY-MM-DD")
                    : "Không thu hồi"
                }
                disabled
                type={`${transaction?.return_date ? "date" : "text"}`}
                label="Hạn thu hồi"
                labelType="top"
              />

              {transaction?.return_deadline && (
                <CustomInput
                  value={
                    transaction?.return_date
                      ? dayjs(transaction.return_date).format("YYYY-MM-DD")
                      : "Chưa thu hồi"
                  }
                  disabled
                  type={`${transaction?.return_date ? "date" : "text"}`}
                  label="Ngày thu hồi"
                  labelType="top"
                />
              )}

               <CustomInput
                disabled
                label="Người / Đơn vị nhận"
                labelType="top"
                value={`${transaction?.u_fullname} - ${transaction?.u_email}`}
              />
            </>
          )}

          {transaction?.type == TransactionTypeEnum.MAINTENANCE && (
            <>
              <CustomInput
                value={
                  transaction?.maintenance_date
                    ? dayjs(transaction.maintenance_date).format("YYYY-MM-DD")
                    : ""
                }
                disabled
                type="date"
                label="Ngày bảo trì"
                labelType="top"
              />
            </>
          )}
          <CustomTextarea
            value={transaction?.reason || " "}
            disabled
            label="Lý do"
            labelType="top"
          />
          <CustomTextarea
            value={transaction?.note || " "}
            disabled
            label="Ghi chú"
            labelType="top"
          />
        </div>
      </div>
    </CustomModal>
  );
}
