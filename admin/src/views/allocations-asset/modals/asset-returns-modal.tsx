import CustomButton from "../../../components/common/custom-button";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import CustomSelect from "../../../components/common/custom-select";
import CustomTable from "../../../components/common/custom-table";
import { ASSET_IN_RETURN_STATUS } from "../../../constants/asset-status.constant";
import { useDetailTransaction, useReturnAssets } from "../../../queries/transaction.query";
import { MdAssignmentReturned } from "react-icons/md";
import { useEffect, useState } from "react";
import { AssetStatusEnum } from "../../../common/enums/asset-status.enum";
import { useModalProvider } from "../../../providers/modal-provider";

type AssetReturnsModalProps = CustomModalProps & {
  transactionCode: string | null;
};

export default function AssetReturnsModal({
  onClose,
  open,
  transactionCode,
}: AssetReturnsModalProps) {
  if (!transactionCode) return null;

  const columns = [
    "Mã lô hàng",
    "Mã tài sản",
    "Tên tài sản",
    "Số lượng",
    "Tình trạng hiện tại",
  ];

  const { transaction } = useDetailTransaction(transactionCode);
  const { openConfirmModal } = useModalProvider();

  const [items, setItems] = useState<
    { batch_code: string; status: number }[]
  >([]);

  useEffect(() => {
    if (transaction?.asset_transaction_items) {
      const initItems = transaction.asset_transaction_items.map((i: any) => ({
        batch_code: i.batch_code,
        status: AssetStatusEnum.GOOD,
      }));
      setItems(initItems);
    }
  }, [transaction]);

  const handleChangeStatus = (batchCode: string, status: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.batch_code === batchCode ? { ...item, status } : item,
      ),
    );
  };
  const {mutate} = useReturnAssets();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     openConfirmModal({
      title: "Xác nhận thu hồi",
      message: "Bạn có chắc chắn muốn thu hồi lô hàng này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate({
          data:{
            items,
            return_date:new Date().toISOString().slice(0, 19).replace("T", " ")
          },
          transactionCode
        },{
          onSuccess:()=>{
            onClose();
          }
        })
      },
    });
  };

  return (
    <CustomModal
      width="w-4xl"
      title="Thu hồi tài sản"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit}>
        <div className="h-[400px] pb-1 mb-2 border-b border-gray-300">
          <CustomTable
            title="Danh sách cấp phát"
            columns={columns}
            data={
              transaction?.asset_transaction_items.map((asset: any) => [
                asset.batch_code,
                asset.asset_code,
                asset.asset_name,
                asset.quantity,
                <CustomSelect
                  value={
                    items.find((x) => x.batch_code === asset.batch_code)
                      ?.status ?? AssetStatusEnum.GOOD
                  }
                  onChange={(e) =>
                    handleChangeStatus(asset.batch_code, Number(e.target.value))
                  }
                  options={ASSET_IN_RETURN_STATUS}
                />,
              ]) || []
            }
          />
        </div>

        <div className="text-right">
          <CustomButton
            type="submit"
            icon={<MdAssignmentReturned size={20} />}
            size="md"
            label="Thu hồi tài sản"
          />
        </div>
      </form>
    </CustomModal>
  );
}
