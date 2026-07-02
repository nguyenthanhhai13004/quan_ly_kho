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
import { useFulfillAllocationRequest } from "../../queries/advisor-request.query";
import generateTransactionCode from "../../utils/generate-transaction-code";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export type AllocationAssetFormProps = {
  onClose?: () => void;
  requestId?: number;
  requestQuantity?: number;
  defaultReceiverId?: number;
};

export default function AllocationAssetForm({
  onClose,
  requestId,
  requestQuantity,
  defaultReceiverId,
}: AllocationAssetFormProps) {
  const columns = ["Hành động", "Mã lô hàng", "Tên tài sản", "Số lượng"];
  const { users } = useUsers({ page: 1, size: 100 });
  const receiverUser = users?.items?.find((u) => u.id === defaultReceiverId);
  const receiverDisplayText = receiverUser 
    ? `${receiverUser.fullname} - ${receiverUser.email}` 
    : "Đang tải...";
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
      code: generateTransactionCode(),
      receiver_id: defaultReceiverId,
    },
  });

  const { mutate: createAllocation } = useCreateAllocationsTransaction();
  const { mutate: fulfillAllocation } = useFulfillAllocationRequest();
  const { openConfirmModal } = useModalProvider();
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultReceiverId) {
      setValue("receiver_id", defaultReceiverId);
    }
  }, [defaultReceiverId, setValue]);

  useEffect(() => {
    if (selectedBatches.length > 0) {
      selectedBatches.forEach((batch, idx) => {
        const currentVal = getValues(`items.${idx}.quantity`);
        if (currentVal === undefined || currentVal === 1) {
          setValue(`items.${idx}.quantity`, idx === 0 && selectedBatches.length === 1 ? (requestQuantity || 1) : 1);
        }
      });
    }
  }, [selectedBatches, requestQuantity, setValue, getValues]);

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

    if (requestQuantity) {
      const totalQuantity = syncedItems.reduce((acc, curr) => acc + curr.quantity, 0);
      if (totalQuantity !== requestQuantity) {
        toast.error(`Số lượng xuất (${totalQuantity}) không khớp yêu cầu (${requestQuantity})`);
        return;
      }
    }

    const payload = {
      ...data,
      items: syncedItems,
    };

    openConfirmModal({
      title: "Xác nhận cấp phát",
      message: "Bạn có chắc chắn muốn cấp phát lô hàng này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        if (requestId) {
          fulfillAllocation(
            { id: requestId, data: { allocation_data: payload } },
            {
              onSuccess: () => {
                reset();
                resetBatchState();
                if (onClose) onClose();
              },
            }
          );
        } else {
          createAllocation(
            { data: payload },
            {
              onSuccess: () => {
                reset();
                resetBatchState();
                setValue("code", generateTransactionCode());
                navigate(0);
              },
            }
          );
        }
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
          <div key={`qty-container-${index}`}>
            <CustomInput
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              defaultValue={requestQuantity && selectedBatches.length === 1 && index === 0 ? requestQuantity : 1}
              name={`items.${index}.quantity`}
              type={requestId ? "hidden" : "number"}
              className="text-xs"
              width="120px"
            />
            {requestId && (
              <CustomInput
                defaultValue={requestQuantity && selectedBatches.length === 1 && index === 0 ? requestQuantity : 1}
                type="number"
                className="text-xs"
                width="120px"
                disabled
              />
            )}
          </div>,
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

        {defaultReceiverId ? (
          <>
            <input type="hidden" {...register("receiver_id", { valueAsNumber: true })} />
            <CustomInput
              label="Người / Đơn vị nhận"
              labelType="top"
              value={receiverDisplayText}
              disabled
              required
              className="w-full"
            />
          </>
        ) : (
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
        )}
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
