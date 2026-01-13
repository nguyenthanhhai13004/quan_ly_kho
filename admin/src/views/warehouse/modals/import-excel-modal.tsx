import { useState } from "react";
import * as XLSX from "xlsx";
import { BiImport } from "react-icons/bi";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import CustomTable from "../../../components/common/custom-table";
import CustomButton from "../../../components/common/custom-button";
import { useModalProvider } from "../../../providers/modal-provider";
import CustomAlert from "../../../components/common/custom-alert";
import ImportExcelView from "../../import-excel";

type ImportedAsset = {
  code: string;
  name: string;
  category?: string;
  quantity?: number;
  cost?: number;
  import_date?: string;
  man?: string;
  note?: string;
};

export default function ImportExcelModal({ onClose, open }: CustomModalProps) {
  const [importedData, setImportedData] = useState<ImportedAsset[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const { openConfirmModal } = useModalProvider();

  const handleImport = () => {
    openConfirmModal({
      title: "Xác nhận nhập dữ liệu",
      message: "Bạn có chắc chắn muốn nhập file Excel này không?",
      confirmText: "Nhập dữ liệu",
      onConfirm: () => {
        console.log("đã xác nhận!");
      },
    });
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Vui lòng chọn file Excel (.xlsx hoặc .xls)");
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
        category: row["Danh mục"] || row["category"] || "",
        quantity: row["Số lượng"] || row["quantity"] || 1,
        cost: row["Giá trị"] || row["cost"] || 1,
        import_date: row["Ngày nhập"] || row["import_date"] || 1,
        man: row["Hạn bảo trì"] || row["import_date"] || 1,
        note: row["Ghi chú"] || row["note"] || 1,
      }));

      setImportedData(formatted);
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const columns = [
    "Mã",
    "Tên tài sản",
    "Danh mục",
    "Số lượng",
    "Giá trị",
    "Ngày nhập",
    "Hạn bảo trì",
    "Ghi chú",
  ];

  return (
    <CustomModal
      title="Nhập tài sản từ file excel"
      width="w-7xl"
      height="h-[500px]"
      onClose={onClose}
      open={open}
    >
     <ImportExcelView/>
    </CustomModal>
  );
}
