import { zodResolver } from "@hookform/resolvers/zod";
import { useTransactionStore } from "../../stores/transactions-store";
import { useForm } from "react-hook-form";
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
import { useModalProvider } from "../../providers/modal-provider";
import TransactionApi from "../../api/transactions-api";
import { toast } from "react-toastify";
import generateTransactionCode from "../../utils/generate-transaction-code";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";

export default function ImportManualForm() {
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
  const {
    importManualState,
    removeSelectedAsset,
    newBatchToggle,
    resetImportManualState,
  } = useTransactionStore();
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
      items: importManualState.selectedAssets.map((asset) => ({
        asset_id: asset.id,
        batch_code:asset.batchCode,
      })),
      code: generateTransactionCode(),
    },
  });
  const { openConfirmModal } = useModalProvider();
  const { mutate } = useImportManualTransaction();
  const onSubmit = (data: ImportManualData) => {
    if (importManualState.selectedAssets.length === 0) {
      toast.error("Danh sách nhập kho phải >= 1");
      return;
    }
    const formItems = getValues("items") || [];
    const syncedItems = importManualState.selectedAssets.map((asset) => {
    const existedItem = formItems.find(
      (i) => i.asset_id === asset.id
    );

    return {
      asset_id: asset.id,
      batch_code: asset.batchCode,
      cost: existedItem?.cost ?? 0,
      quantity: existedItem?.quantity ?? 1,
      manufacture_date: existedItem?.manufacture_date,
      maintenance_due: existedItem?.maintenance_due,
      expiration_date: existedItem?.expiration_date,
    };
  });

  if (syncedItems.length === 0) {
    toast.error("Danh sách tài sản không hợp lệ");
    return;
  }
    openConfirmModal({
      title: "Xác nhận nhập kho",
      message: "Bạn có chắc chắn muốn nhập kho các tài sản này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(
          { importManualData:{
            ...data,
            items:syncedItems
          } },
          {
            onSuccess: () => {
              reset();
              resetImportManualState();
              setValue("code",generateTransactionCode())
            },
          },
        );
      },
    });
  };
  const handleCheckBatch = async (index: number) => {
    const batchCode = getValues("items")?.[index].batch_code;
    if (!batchCode) return;
    try {
      const response = await TransactionApi.getDetailBatch(batchCode);
      if (response.data) {
        toast.info(`${batchCode} tồn tại`);
      }
    } catch (error) {
      toast.error(error as string);
      return;
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomTable
        columns={columns}
        size="small"
        data={importManualState.selectedAssets.map((item, index) => [
          <>
            <CustomIcon
              key={`trash-${index}`}
              icon={<BiTrash size={16} />}
              label="Xóa"
              onClick={() => removeSelectedAsset(index)}
              variant="danger"
            />
            {/* <CustomIcon
              key={`check-${index}`}
              icon={<ImSpellCheck size={16} />}
              label="Kiểm tra lô hàng"
              onClick={() => handleCheckBatch(index)}
              variant="success"
            /> */}
          </>,
          <CustomInput
            key={`batchCode-${index}`}
            {...register(`items.${index}.batch_code`)}
            value={item.batchCode}
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
              {...register(`items.${index}.asset_id`, { valueAsNumber: true })}
              className="hidden"
              type="number"
              readOnly
              value={item.id}
            />
          </div>,
          item.name,
          <CustomInput
            key={`cost-${index}`}
            {...register(`items.${index}.cost`, { valueAsNumber: true })}
            defaultValue={0}
            name={`items.${index}.cost`}
            type="number"
            className="text-xs"
            width="120px"
            disabled={!item.newBatch}
          />,
          <CustomInput
            key={`quantity-${index}`}
            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            defaultValue={1}
            name={`items.${index}.quantity`}
            type="number"
            className="text-xs"
            width="120px"
          />,
          <CustomInput
            key={`manufactureDate-${index}`}
            type="date"
            className="text-xs"
            width="120px"
            disabled={!item.newBatch}
            {...register(`items.${index}.manufacture_date`)}
          />, 

          <CustomInput
            key={`maintenanceDue-${index}`}
            className="text-xs"
            width="120px"
            type="date"
            disabled={!item.newBatch}
            {...register(`items.${index}.maintenance_due`)}
          />,
          <CustomInput
            key={`expirationDate-${index}`}
            className="text-xs"
            width="120px"
            type="date"
            disabled={!item.newBatch}
            {...register(`items.${index}.expiration_date`)}
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
