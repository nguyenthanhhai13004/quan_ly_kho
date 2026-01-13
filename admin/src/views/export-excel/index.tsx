import { useState } from "react";
import TransactionApi from "../../api/transactions-api";
import CustomExcelInput from "../../components/common/custom-excel-input";
import * as XLSX from "xlsx";
import type { TExportExcelItem } from "../../types/global";
import CustomTable from "../../components/common/custom-table";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomTextarea from "../../components/common/custom-textarea";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useModalProvider } from "../../providers/modal-provider";
import {
  ExportExcelSchema,
  type ExportExcelData,
} from "../../dtos/transaction/export-excel.dto";
import { useExportExcelTransaction } from "../../queries/transaction.query";
import generateTransactionCode from "../../utils/generate-transaction-code";
import CustomIcon from "../../components/common/custom-icon";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";
export default function ExportExcelView() {
  const columns = ["Mã lô", "Tên tài sản", "Số lượng"];
  const [errors, setErrors] = useState<{ reasons: string[]; index: number }[]>(
    [],
  );
  const [data, setData] = useState<TExportExcelItem[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    reset,
    setValue,
  } = useForm<ExportExcelData>({
    resolver: zodResolver(ExportExcelSchema),
    defaultValues:{
      code:generateTransactionCode()
    }
  });
  const { mutate } = useExportExcelTransaction();
  const { openConfirmModal } = useModalProvider();
  const handleFile = async (file: File) => {
    setCurrentFile(null);
    setErrors([]);
    setData([]);
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
      return;
    }
    setCurrentFile(file);
    try {
      const response = await TransactionApi.validationExportExcel(file);
      if (response.data?.length > 0) {
        setErrors(response.data);
        return;
      }
    } catch (error) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(sheet);

      const formatted = json.map((row, index) => ({
        name: row["Tên tài sản"] || row["name"] || "Không rõ tên",
        quantity: row["Số lượng"] || row["quantity"] || 1,
        batchCode: row["Mã lô"] || row["batch_code"] || "",
      })) as TExportExcelItem[];
      setData(formatted);
    };
    reader.readAsBinaryString(file);
  };
  const onSubmit = (data: ExportExcelData) => {
    if (!currentFile) return;
    openConfirmModal({
      title: "Xác nhận xuất kho",
      message: "Bạn có chắc chắn muốn xuất kho không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(
          {
            exportExcelFileData: {
              ...data,
              file: currentFile,
            },
          },
          {
            onSuccess: () => {
              setData([]);
              reset();
              setCurrentFile(null);
              setValue("code", generateTransactionCode());
            },
          },
        );
      },
    });
  };
  return (
    <div className="grid grid-cols-3 gap-2 h-full">
      <CustomExcelInput onFileSelect={handleFile} />

      {errors.length > 0 && (
        <div className="col-span-2 bg-red-50 border border-red-300 rounded-xl p-3 overflow-y-auto">
          <h3 className="text-red-600 font-semibold mb-2">
            Có lỗi, vui lòng kiểm tra lại file dữ liệu
          </h3>
          {errors.map((err) => (
            <div
              key={err.index}
              className="mb-2 p-2 bg-white rounded-md shadow-sm border border-red-200"
            >
              <p className="font-medium text-red-500">➤ Hàng {err.index}</p>
              <ul className="list-disc ml-5 text-sm text-red-600">
                {err.reasons.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.length > 0 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full flex-col col-span-2"
        >
          <div className="grid grid-cols-2 pt-5 gap-3">
            <div className="flex flex-col gap-5">
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
                error={formErrors.code?.message}
                type="text"
                label="Mã đơn"
                labelType="top"
              />
              <CustomInput
                {...register("name")}
                required
                placeholder="Ví dụ : Đơn xuất kho cho ..."
                error={formErrors.name?.message}
                type="text"
                label="Tên đơn"
                labelType="top"
              />
              <CustomInput
                {...register("export_date")}
                required
                error={formErrors.export_date?.message}
                type="date"
                label="Ngày xuất kho"
                labelType="top"
              />

              <CustomTextarea
                {...register("reason")}
                error={formErrors.reason?.message}
                label="Lý do"
                labelType="top"
                placeholder="Nhập lý do"
              />
              <CustomTextarea
                {...register("note")}
                error={formErrors.note?.message}
                label="Ghi chú"
                placeholder="Nhập ghi chú"
                labelType="top"
              />
            </div>
            <div className="flex flex-col gap-5">
              <CustomInput
                label="Tên người nhận"
                required
                placeholder="Nguyen Van A"
                labelType="top"
                {...register("receiver_name")}
                error={formErrors.receiver_name?.message}
              />
              <CustomInput
                label="Số điện thoại"
                required
                placeholder="099999999"
                labelType="top"
                {...register("receiver_phone")}
                error={formErrors.receiver_phone?.message}
              />
              <CustomTextarea
                required
                placeholder="abc, TP. Hà Nội"
                label="Địa chỉ"
                labelType="top"
                {...register("receiver_address")}
                error={formErrors.receiver_address?.message}
              />
            </div>
          </div>
          <div className="mb-3">
            <CustomTable
              title="Preview"
              columns={columns}
              data={
                data.map((item) => [
                  item.batchCode,
                  item.name,
                  item.quantity,
                ]) || []
              }
            />
          </div>
          <div className="text-right">
            <CustomButton type="submit" label="Xuất kho" size="md" />
          </div>
        </form>
      )}
    </div>
  );
}
