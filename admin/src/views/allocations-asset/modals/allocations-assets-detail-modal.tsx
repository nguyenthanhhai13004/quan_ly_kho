import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import CustomTextarea from "../../../components/common/custom-textarea";
import { mockTransactionDetails } from "../../../mocks";
import AssetInTransactionTable from "../../warehouse/modals/asset-in-transaction-table";

interface AllocationsAssetsDetailModalProps extends CustomModalProps {
  transactionId: number | null;
}

export default function AllocationsAssetsDetailModal({
  transactionId,
  onClose,
  open,
}: AllocationsAssetsDetailModalProps) {
  const transaction = !transactionId ? mockTransactionDetails[1] : null;

  return (
    <CustomModal title={`Chi tiết đơn hàng`} width="w-4xl" onClose={onClose} open={open}>
      <div className="grid grid-cols-2 gap-2">
        <div className="overflow-auto bg-gray-200 p-4 pt-5 rounded-2xl">
            <AssetInTransactionTable assets={transaction?.assets||[]}/>
        </div>
        <div className="flex flex-col gap-5 pt-5 bg-gray-200 p-4 rounded-2xl">
          <CustomInput value={transaction?.date} disabled type="date" label="Ngày cấp" labelType="top" />
          <CustomInput value={transaction?.date} disabled type="date" label="Hạn thu hồi" labelType="top" />
          <CustomTextarea value={transaction?.note} disabled label="Ghi chú" labelType="top" />
          <CustomInput value={transaction?.receiver.name} disabled type="text" label="Người/ Đơn vị tiếp nhận" labelType="top" />
        </div>
      </div>
    </CustomModal>
  );
}
