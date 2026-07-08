import dayjs from "dayjs";
import { TbPhoneDone } from "react-icons/tb";
import CustomButton from "../../../components/common/custom-button";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import CustomTable from "../../../components/common/custom-table";
import {
  useDetailTransaction,
  useUpdateMaintenance,
} from "../../../queries/transaction.query";
import CustomSelect from "../../../components/common/custom-select";
import { ASSET_IN_RETURN_STATUS } from "../../../constants/asset-status.constant";
import CustomInput from "../../../components/common/custom-input";
import { useEffect, useState } from "react";
import { AssetStatusEnum } from "../../../common/enums/asset-status.enum";
import { useModalProvider } from "../../../providers/modal-provider";

type UpdateMaintenanceModalProps = CustomModalProps & {
  transactionCode: string | null;
};
export default function UpdateMaintenanceModal({
  onClose,
  open,
  transactionCode,
}: UpdateMaintenanceModalProps) {
  const { transaction } = useDetailTransaction(transactionCode);
  const { openConfirmModal, closeModal } = useModalProvider();
  const [items, setItems] = useState<
    { batch_code: string; status: number; next_maintenance_date: string }[]
  >([]);
  const columns = [
    "Mã lô hàng",
    "Mã tài sản",
    "Tên tài sản",
    "Số lượng",
    "Tình trạng hiện tại",
    "Hạn bảo trì tiếp theo",
  ];

  useEffect(() => {
    if (transaction?.asset_transaction_items) {
      const initItems = transaction.asset_transaction_items.map((i: any) => {
        const defaultNextMaintenance = dayjs()
          .add(3, "month")
          .format("YYYY-MM-DD");
        return {
          batch_code: i.batch_code,
          status: AssetStatusEnum.GOOD,
          next_maintenance_date: defaultNextMaintenance,
        };
      });
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
  const handleChangeNextMaintenanceDate = (batchCode: string, date: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.batch_code === batchCode
          ? { ...item, next_maintenance_date: date }
          : item,
      ),
    );
  };
  const { mutate } = useUpdateMaintenance();

  if (!transactionCode) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openConfirmModal({
      title: "Xác nhận bảo trì",
      message:
        "Bạn có chắc chắn muốn cập nhật trạng thái bảo trì cho lô hàng này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(
          {
            data: {
              items,
            },
            transactionCode,
          },
          {
            onSuccess: () => {
              closeModal();
            },
          },
        );
      },
    });
  };
  return (
    <CustomModal
      width="max-w-4xl"
      title="Cập nhật trạng thái bảo trì"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit}>
        <div className="h-[400px] pb-1 mb-2 border-b border-gray-300">
          <CustomTable
            title="Danh sách tài sản được bảo trì"
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
                <CustomInput
                  value={
                    items.find((x) => x.batch_code === asset.batch_code)
                      ?.next_maintenance_date || ""
                  }
                  onChange={(e) =>
                    handleChangeNextMaintenanceDate(
                      asset.batch_code,
                      e.target.value,
                    )
                  }
                  type="date"
                  className="w-[150px]"
                />,
              ]) || []
            }
          />
        </div>

        <div className="text-right">
          <CustomButton
            type="submit"
            icon={<TbPhoneDone />}
            size="md"
            label="Cập nhật trạng thái"
          />
        </div>
      </form>
    </CustomModal>
  );
}
