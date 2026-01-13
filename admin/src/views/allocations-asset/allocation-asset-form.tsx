import { BiSend, BiTrash } from "react-icons/bi";
import CustomIcon from "../../components/common/custom-icon";
import CustomTable from "../../components/common/custom-table";
import { useTransactionStore } from "../../stores/transactions-store";
import CustomInput from "../../components/common/custom-input";
import CustomButton from "../../components/common/custom-button";
import CustomTextarea from "../../components/common/custom-textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalProvider } from "../../providers/modal-provider";
import { toast } from "react-toastify";
import {
  CreateAllocationSchema,
  type CreateAllocationData,
} from "../../dtos/transaction/create-allocation.dto";
import { useUsers } from "../../queries/user.query";
import CustomSelect from "../../components/common/custom-select";
import { useCreateAllocationsTransaction } from "../../queries/transaction.query";
import generateTransactionCode from "../../utils/generate-transaction-code";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";

export default function AllocationAssetForm() {
  const columns = ["Hành động", "Mã lô hàng", "Tên tài sản", "Số lượng"];
  const { users } = useUsers();
  const {
    batchState: { selectedBatches },
    removeBatch,
    resetBatchState,
  } = useTransactionStore();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm<CreateAllocationData>({
    resolver: zodResolver(CreateAllocationSchema),
    defaultValues: {
      items: selectedBatches.map((batch) => ({
        batch_code: batch.batchCode,
      })),
      code:generateTransactionCode()
    },
  });
  const { mutate } = useCreateAllocationsTransaction();
  const { openConfirmModal } = useModalProvider();
  const onSubmit = (data: CreateAllocationData) => {
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
      toast.error("Danh sách vật tư không hợp lệ");
      return;
    }
    openConfirmModal({
      title: "Xác nhận cấp phát",
      message: "Bạn có chắc chắn muốn cấp phát lô hàng này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(
          {
            data:{
              ...data,
              items:syncedItems
            }
          },
          {
            onSuccess: () => {
              reset();
              resetBatchState();
              generateTransactionCode()
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
            width="150px"
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
              onClick={()=>setValue("code",generateTransactionCode())}
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
          placeholder="Ví dụ : Đơn cho ..."
          error={errors.name?.message}
          type="text"
          label="Tên đơn"
          labelType="top"
        />

        <CustomInput
          {...register("allocation_date")}
          required
          error={errors.allocation_date?.message}
          type="date"
          label="Ngày cấp phát"
          labelType="top"
        />

        <CustomInput
          {...register("return_deadline")}
          error={errors.return_deadline?.message}
          type="date"
          label="Hạn thu hồi"
          labelType="top"
        />

        <CustomTextarea
          {...register("reason")}
          error={errors.reason?.message}
          label="Lý do"
          labelType="top"
        />
        <CustomTextarea
          {...register("note")}
          error={errors.note?.message}
          label="Ghi chú"
          labelType="top"
        />

        <CustomSelect
          register={register("receiver_id", {
            required: true,
            valueAsNumber: true,
          })}
          required
          error={errors.receiver_id?.message}
          labelType="top"
          label="Người / Đơn vị nhận"
          className="w-full"
          options={
            users?.items?.map((u) => ({
              label: `${u.fullname} - ${u.email}`,
              value: u.id,
            })) || []
          }
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
          label="Cấp phát tài sản"
          size="md"
          type="submit"
          icon={<BiSend size={20} />}
        />
      </div>
    </form>
  );
}
