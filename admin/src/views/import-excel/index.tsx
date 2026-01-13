import { useState } from "react";
import TransactionApi from "../../api/transactions-api";
import CustomExcelInput from "../../components/common/custom-excel-input";
import * as XLSX from "xlsx";
import type { TImportExcelItem } from "../../types/global";
import CustomTable from "../../components/common/custom-table";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomTextarea from "../../components/common/custom-textarea";
import { excelToJsDate } from "../../utils/excel-to-js-date";
import { useForm } from "react-hook-form";
import {
  ImportExcelSchema,
  type ImportExcelData,
} from "../../dtos/transaction/import-excel.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImportExcelTransaction } from "../../queries/transaction.query";
import { useModalProvider } from "../../providers/modal-provider";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";
import CustomIcon from "../../components/common/custom-icon";
import generateTransactionCode from "../../utils/generate-transaction-code";
export default function ImportExcelView() {
  const columns = [
    "Mã lô",
    "Mã tài sản",
    "Tên tài sản",
    "Số lượng",
    "Giá trị",
    "Ngày sản xuất",
    "Hạn bảo trì",
    "Hạn sử dụng",
  ];
  const [errors, setErrors] = useState<{ reasons: string[]; index: number }[]>(
    [],
  );
  const [data, setData] = useState<TImportExcelItem[]>([]);
  const { mutate } = useImportExcelTransaction();
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    reset,
    setValue,
  } = useForm<ImportExcelData>({
    resolver: zodResolver(ImportExcelSchema),
    defaultValues:{
      code:generateTransactionCode()
    }
  });
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
      const response = await TransactionApi.validationImportExcel(file);
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
        code: row["Mã tài sản"] || row["asset_code"] || `UNKNOWN-${index + 1}`,
        name: row["Tên"] || row["name"] || "Không rõ tên",
        quantity: row["Số lượng"] || row["quantity"] || 1,
        cost: row["Giá trị"] || row["cost"] || 1,
        batchCode: row["Mã lô"] || row["batch_code"] || "Lô mới",
        expirationDate: row["Hạn sử dụng"],
        maintenanceDue: row["Hạn bảo trì"],
        manufactureDate: row["Ngày sản xuất"],
      })) as TImportExcelItem[];
      setData(formatted);
    };
    reader.readAsBinaryString(file);
  };
  const onSubmit = (data: ImportExcelData) => {
    if (!currentFile) return;
    openConfirmModal({
      title: "Xác nhận nhập kho",
      message: "Bạn có chắc chắn muốn nhập kho các tài sản này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(
          {
            importExcelFileData: {
              ...data,
              file: currentFile,
            },
          },
          {
            onSuccess: () => {
              reset();
              setCurrentFile(null);
              setData([]);
              setValue("code",generateTransactionCode())
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
          <div className="grid grid-cols-3 pt-5 gap-5">
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
              type="text"
              label="Mã đơn"
              labelType="top"
            />
            <CustomInput
              {...register("name")}
              required
              error={formErrors.name?.message}
              type="text"
              label="Tên đơn"
              labelType="top"
            />
            <CustomInput
              {...register("received_date")}
              required
              error={formErrors.received_date?.message}
              type="date"
              label="Ngày nhận"
              labelType="top"
            />
            <CustomInput
              label="Nơi gửi"
              labelType="top"
              placeholder="Khu phố A ..."
              {...register("sender_location")}
              error={formErrors.sender_location?.message}
            />
            <CustomTextarea
              {...register("reason")}
              placeholder="Nhập lý do"
              error={formErrors.reason?.message}
              label="Lý do"
              labelType="top"
            />
            <CustomTextarea
              {...register("note")}
              error={formErrors.note?.message}
              label="Ghi chú"
              placeholder="Nhập ghi chú"
              labelType="top"
            />
          </div>
          <div className="mb-3">
            <CustomTable
              title="Preview"
              columns={columns}
              data={
                data.map((item) => [
                  item.batchCode,
                  item.code,
                  item.name,
                  item.quantity,
                  item.cost,
                  excelToJsDate(item.manufactureDate)?.toLocaleString(),
                  excelToJsDate(item.maintenanceDue)?.toLocaleString(),
                  excelToJsDate(item.expirationDate)?.toLocaleString(),
                ]) || []
              }
            />
          </div>
          <div className="text-right">
            <CustomButton type="submit" label="Nhập kho" size="md" />
          </div>
        </form>
      )}
    </div>
  );
}
