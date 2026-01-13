import { useTransactionStore } from "../../stores/transactions-store";
import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import { BiImport, BiTrash } from "react-icons/bi";
import CustomInput from "../../components/common/custom-input";
import CustomButton from "../../components/common/custom-button";
import { useForm } from "react-hook-form";
import {
  ExportManualSchema,
  type ExportManualData,
} from "../../dtos/transaction/export-manual.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomTextarea from "../../components/common/custom-textarea";
import { useExportManualTransaction } from "../../queries/transaction.query";
import { useModalProvider } from "../../providers/modal-provider";
import { toast } from "react-toastify";
import generateTransactionCode from "../../utils/generate-transaction-code";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";

export default function ExportManualForm() {
  const columns = ["Hành động", "Mã lô hàng", "Tên tài sản", "Số lượng"];
  const {
    batchState: { selectedBatches },
    resetBatchState,
    removeBatch,
  } = useTransactionStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<ExportManualData>({
    resolver: zodResolver(ExportManualSchema),
    defaultValues: {
      items: selectedBatches.map((batch) => ({
        batch_code: batch.batchCode,
      })),
      code: generateTransactionCode(),
    },
  });
  const { mutate } = useExportManualTransaction();
  const { openConfirmModal } = useModalProvider();
  const onSubmit = async (data: ExportManualData) => {
    if (selectedBatches.length === 0) {
      toast.error("Danh sách lô hàng phải có ít nhất 1");
      return;
    }
    const formItems = getValues("items") || [];

    const syncedItems = selectedBatches.map((batch) => {
      const existedItem = formItems.find(
        (i) => i.batch_code === batch.batchCode,
      );

      return {
        batch_code: batch.batchCode,
        quantity: existedItem?.quantity ?? 1,
      };
    });

    if (syncedItems.length === 0) {
      toast.error("Danh sách xuất kho không hợp lệ");
      return;
    }
    openConfirmModal({
      title: "Xác nhận xuất kho",
      message: "Bạn có chắc chắn muốn xuất kho các tài sản này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(
          { exportManualData: {
            ...data,
            items: syncedItems,
          }, },
          {
            onSuccess: () => {
              reset();
              resetBatchState();
              setValue("code", generateTransactionCode());
            },
          },
        );
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTable
        columns={columns}
        size="small"
        data={selectedBatches.map((item, index) => [
          <>
            <CustomIcon
              key={`trash-${index}`}
              icon={<BiTrash size={16} />}
              label="Xóa"
              variant="danger"
              onClick={() => removeBatch(item.batchCode)}
            />
          </>,
          <CustomInput
            key={`batchCode-${index}`}
            {...register(`items.${index}.batch_code`)}
            name={`items.${index}.batch_code`}
            className="text-xs"
            width="120px"
            value={item.batchCode}
            type="text"
            disabled
          />,
          item.name,
          <CustomInput
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            defaultValue={1}
            name={`items.${index}.quantity`}
            type="number"
            className="text-xs"
            width="120px"
          />,
        ])}
      />
      <div className="flex flex-col gap-5 mb-3 mt-5">
        <CustomInput
          {...register("code")}
          required
          disabled
          icon={
            <CustomIcon
              label="Tạo tự động"
              variant="info"
              onClick={() => setValue("code", generateTransactionCode())}
              icon={<MdOutlineMotionPhotosAuto size={16} />}
            />
          }
          error={errors.code?.message}
          type="text"
          label="Mã đơn"
          labelType="top"
        />
        <CustomInput
          {...register("name")}
          required
          placeholder="Ví dụ : Đơn xuất kho cho ..."
          error={errors.name?.message}
          type="text"
          label="Tên đơn"
          labelType="top"
        />
        <CustomInput
          {...register("export_date")}
          required
          error={errors.export_date?.message}
          type="date"
          label="Ngày xuất kho"
          labelType="top"
        />

        <CustomTextarea
          {...register("reason")}
          error={errors.reason?.message}
          label="Lý do"
          placeholder="Ví dụ : Lý do ..."
          labelType="top"
        />
        <CustomTextarea
          {...register("note")}
          error={errors.note?.message}
          label="Ghi chú"
          labelType="top"
          placeholder="Ví dụ : Ghi chú ..."
        />

        <CustomInput
          label="Tên người nhận"
          required
          placeholder="Nguyen Van A"
          labelType="top"
          {...register("receiver_name")}
          error={errors.receiver_name?.message}
        />
        <CustomInput
          label="Số điện thoại"
          required
          placeholder="099999999"
          labelType="top"
          {...register("receiver_phone")}
          error={errors.receiver_phone?.message}
        />
        <CustomTextarea
          required
          placeholder="abc, TP. Hà Nội"
          label="Địa chỉ"
          labelType="top"
          {...register("receiver_address")}
          error={errors.receiver_address?.message}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <CustomButton
          className="w-full"
          variant="default"
          label="Hủy"
          size="md"
        />
        <CustomButton
          className="w-full"
          label="Xuất tài sản"
          size="md"
          type="submit"
          icon={<BiImport size={20} />}
        />
      </div>
    </form>
  );
}
