import { zodResolver } from "@hookform/resolvers/zod";
import { useTransactionStore } from "../../stores/transactions-store";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import {
  ImportManualSchema,
  type ImportManualData,
} from "../../dtos/transaction/import-manual.dto";
import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import { BiImport, BiTrash } from "react-icons/bi";
import CustomInput from "../../components/common/custom-input";
import CustomTextarea from "../../components/common/custom-textarea";
import CustomButton from "../../components/common/custom-button";
import { useImportManualTransaction } from "../../queries/transaction.query";
import { useFulfillRecallRequest } from "../../queries/advisor-request.query";
import { useModalProvider } from "../../providers/modal-provider";
import { toast } from "react-toastify";
import generateTransactionCode from "../../utils/generate-transaction-code";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export type ImportManualFormProps = {
  onClose?: () => void;
  requestId?: number;
};

export default function ImportManualForm({
  onClose,
  requestId,
}: ImportManualFormProps = {}) {
  const columns = [
    "Hành động",
    "Mã lô hàng",
    "Mã tài sản",
    "Tên tài sản",
    "Giá trị",
    "Số lượng",
    "Ngày sản xuất",
    "Hạn bảo trì",
    "Hạn sử dụng",
  ];
  const { importManualState, removeSelectedAsset, resetImportManualState } =
    useTransactionStore();

  const buildFormItem = useCallback(
    (
      asset: (typeof importManualState.selectedAssets)[number],
      existedItem?: ImportManualData["items"][number],
    ): ImportManualData["items"][number] => ({
      row_key: asset.rowKey,
      asset_id: asset.id,
      batch_code: asset.newBatch ? undefined : asset.batchCode,
      new_batch_code: asset.newBatch ? asset.batchCode : undefined,
      is_new_batch: asset.newBatch,
      cost: existedItem?.cost ?? 0,
      quantity: existedItem?.quantity ?? 1,
      manufacture_date: existedItem?.manufacture_date,
      maintenance_due: existedItem?.maintenance_due,
      expiration_date: existedItem?.expiration_date,
    }),
    [],
  );

  const buildPayloadItem = useCallback(
    (
      asset: (typeof importManualState.selectedAssets)[number],
      existedItem?: ImportManualData["items"][number],
    ) => {
      const item = buildFormItem(asset, existedItem);

      return {
        asset_id: item.asset_id,
        batch_code: item.batch_code,
        new_batch_code: item.new_batch_code,
        is_new_batch: item.is_new_batch,
        cost: item.cost,
        quantity: item.quantity,
        manufacture_date: item.manufacture_date,
        maintenance_due: item.maintenance_due,
        expiration_date: item.expiration_date,
      };
    },
    [buildFormItem],
  );

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm<ImportManualData>({
    resolver: zodResolver(ImportManualSchema),
    defaultValues: {
      received_date: importManualState.receivedDate,
      sender_location: importManualState.senderLocation,
      reason: importManualState.reason,
      note: importManualState.notes,
      items: importManualState.selectedAssets.map((asset) =>
        buildFormItem(asset),
      ),
      code: generateTransactionCode(),
    },
  });
  const { openConfirmModal } = useModalProvider();
  const { mutate: importManual } = useImportManualTransaction();
  const { mutate: fulfillRecall } = useFulfillRecallRequest();
  const navigate = useNavigate();

  useEffect(() => {
    const formItems = getValues("items") || [];
    const formItemsByRowKey = new Map(
      formItems.map((item) => [item.row_key, item]),
    );
    const nextItems = importManualState.selectedAssets.map((asset, index) => {
      const existedItem =
        formItemsByRowKey.get(asset.rowKey) ?? formItems[index];

      return buildFormItem(asset, existedItem);
    });

    setValue("items", nextItems as ImportManualData["items"]);
  }, [buildFormItem, getValues, importManualState.selectedAssets, setValue]);

  const onSubmit = (data: ImportManualData) => {
    if (importManualState.selectedAssets.length === 0) {
      toast.error("Danh sách nhập kho phải >= 1");
      return;
    }
    const formItems = getValues("items") || [];
    const formItemsByRowKey = new Map(
      formItems.map((item) => [item.row_key, item]),
    );
    const syncedItems = importManualState.selectedAssets.map((asset, index) => {
      const existedItem =
        formItemsByRowKey.get(asset.rowKey) ?? formItems[index];

      return buildPayloadItem(asset, existedItem);
    });

    if (syncedItems.length === 0) {
      toast.error("Danh sách tài sản không hợp lệ");
      return;
    }

    const payload = {
      ...data,
      items: syncedItems,
    };

    openConfirmModal({
      title: requestId ? "Xác nhận thu hồi" : "Xác nhận nhập kho",
      message: requestId
        ? "Bạn có chắc chắn muốn thu hồi tài sản này không?"
        : "Bạn có chắc chắn muốn nhập kho các tài sản này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        if (requestId) {
          fulfillRecall(
            { id: requestId, data: { import_data: payload } },
            {
              onSuccess: () => {
                reset();
                resetImportManualState();
                if (onClose) onClose();
              },
            },
          );
        } else {
          importManual(
            { importManualData: payload },
            {
              onSuccess: () => {
                reset();
                resetImportManualState();
                setValue("code", generateTransactionCode());
                navigate(0);
              },
            },
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
        rowKeys={importManualState.selectedAssets.map((item) => item.rowKey)}
        data={importManualState.selectedAssets.map((item, index) => {
          const rowKey = item.rowKey;

          return [
            <CustomIcon
              key={`trash-${rowKey}`}
              icon={<BiTrash size={16} />}
              label="Xóa"
              onClick={() => removeSelectedAsset(rowKey)}
              variant="danger"
            />,
            <CustomInput
              key={`batchCode-${rowKey}`}
              {...register(`items.${index}.batch_code`)}
              value={item.batchCode ?? ""}
              name={`items.${index}.batch_code`}
              className="text-xs"
              width="120px"
              placeholder=""
              type="text"
              // value={item.newBatch ? "" : getValues(`items.${index}.batch_code`)}
              disabled={true}
            />,
            <div>
              {item.code}
              <input
                {...register(`items.${index}.asset_id`, {
                  valueAsNumber: true,
                })}
                className="hidden"
                type="number"
                readOnly
                value={item.id}
              />
            </div>,
            item.name,
            <CustomInput
              key={`cost-${rowKey}`}
              {...register(`items.${index}.cost`, { valueAsNumber: true })}
              defaultValue={0}
              name={`items.${index}.cost`}
              type="number"
              className="text-xs"
              width="120px"
              disabled={!item.newBatch}
            />,
            <CustomInput
              key={`quantity-${rowKey}`}
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              defaultValue={1}
              name={`items.${index}.quantity`}
              type="number"
              className="text-xs"
              width="120px"
            />,
            <CustomInput
              key={`manufactureDate-${rowKey}`}
              type="date"
              className="text-xs"
              width="120px"
              disabled={!item.newBatch}
              {...register(`items.${index}.manufacture_date`)}
            />,

            <CustomInput
              key={`maintenanceDue-${rowKey}`}
              className="text-xs"
              width="120px"
              type="date"
              disabled={!item.newBatch}
              {...register(`items.${index}.maintenance_due`)}
            />,
            <CustomInput
              key={`expirationDate-${rowKey}`}
              className="text-xs"
              width="120px"
              type="date"
              disabled={!item.newBatch}
              {...register(`items.${index}.expiration_date`)}
            />,
          ];
        })}
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
          error={errors.name?.message}
          type="text"
          label="Tên đơn"
          placeholder="ví dụ : Nhập kho tháng 9"
          labelType="top"
        />
        <CustomInput
          {...register("received_date")}
          required
          error={errors.received_date?.message}
          type="date"
          label="Ngày nhận"
          labelType="top"
        />
        <CustomInput
          label="Nơi gửi"
          placeholder="ví dụ : Khi phố 5, ...."
          labelType="top"
          {...register("sender_location")}
          error={errors.sender_location?.message}
        />
        <CustomTextarea
          {...register("reason")}
          error={errors.reason?.message}
          label="Lý do"
          labelType="top"
          placeholder="Ví dụ : Lý do ..."
        />
        <CustomTextarea
          {...register("note")}
          error={errors.note?.message}
          label="Ghi chú"
          labelType="top"
          placeholder="Ví dụ : Ghi chú ..."
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
          label="Nhập tài sản"
          size="md"
          type="submit"
          icon={<BiImport size={20} />}
        />
      </div>
    </form>
  );
}
