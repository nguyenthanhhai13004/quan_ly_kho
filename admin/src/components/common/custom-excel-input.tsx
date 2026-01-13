import { useState } from "react";
import { BiImport } from "react-icons/bi";

type Props = {
  onFileSelect: (file: File) => void;
  accept?: string;
};

export default function CustomExcelInput({ onFileSelect, accept = ".xlsx,.xls" }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFile = (file: File) => {
    setFileName(file.name);
    onFileSelect(file);
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

  return (
    <div
      className={`col-span-1 flex flex-col justify-center items-center rounded-2xl border-2 border-dashed transition-colors cursor-pointer 
      ${isDragging ? "bg-blue-100 border-blue-400" : "bg-gray-100 border-gray-300"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <BiImport size={40} className="text-gray-500" />

      {fileName ? (
        <>
          <p className="mt-3 text-gray-700 font-medium text-center break-all px-4">
            {fileName}
          </p>
          <p className="text-xs text-green-600 mt-1">Đã tải lên thành công!</p>

          <label className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm cursor-pointer hover:bg-blue-600">
            Chọn file khác
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </>
      ) : (
        <>
          <p className="mt-3 text-gray-700 text-center px-2">
            Kéo file Excel (.xlsx) vào đây
          </p>
          <p className="text-xs text-gray-500 mt-1">hoặc</p>

          <label className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm cursor-pointer hover:bg-blue-600">
            Chọn file
            <input
              type="file"
              accept={accept}
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </>
      )}
    </div>
  );
}
