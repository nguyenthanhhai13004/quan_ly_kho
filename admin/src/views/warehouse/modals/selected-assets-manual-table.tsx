import { BiSearch, BiTrash } from "react-icons/bi";
import CustomIcon from "../../../components/common/custom-icon";
import CustomInput from "../../../components/common/custom-input";
import CustomTable from "../../../components/common/custom-table";
import CustomCheckbox from "../../../components/common/custom-checkbox";
import { useEffect, useState } from "react";


export type AssetFormData = {
  id: number;
  newBatch: boolean;
  batchCode: string;
  assetCode: string;
  assetName: string;
  cost: number;
  quantity: number;
  manufactureDate?: string;
  maintenanceDue?: string;
  expirationDate?: string;
};

export type SelectedAssetsManualTableProps = {
  data: AssetFormData[];
  onDeleted?: (asset: AssetFormData) => void;
  onChange?: (updatedData: AssetFormData[]) => void;
};

const columns = [
  "Lô hàng mới",
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

export default function SelectedAssetsManualTable({
  data,
  onDeleted,
  onChange,
}: SelectedAssetsManualTableProps) {
  const [rowsData, setRowsData] = useState<AssetFormData[]>(
    data.map((item) => ({
      id: item.id,
      newBatch: false,
      batchCode: "",
      assetCode: item.assetCode,
      assetName: item.assetCode,
      cost: 1,
      quantity: 1,
      manufactureDate: undefined,
      maintenanceDue: undefined,
      expirationDate: undefined,
    })),
  );

  useEffect(() => {
    onChange?.(rowsData);
  }, [rowsData, onChange]);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setRowsData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, newBatch: checked } : row)),
    );
  };

  const handleInputChange = (
    id: number,
    field: keyof AssetFormData,
    value: any,
  ) => {
    setRowsData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  return (
    <CustomTable
      columns={columns}
      size="small"
      data={rowsData.map((row) => [
        <CustomCheckbox
          checked={row.newBatch}
          onChange={(e) => handleCheckboxChange(row.id, e.target.checked)}
        />,
        <>
          <CustomIcon
            icon={<BiTrash size={20} />}
            label="Xóa"
            variant="danger"
            onClick={() => onDeleted?.(data.find((d) => d.id === row.id)!)}
          />
          {!row.newBatch && (
            <CustomIcon
              icon={<BiSearch size={20} />}
              label="Kiểm tra thông tin lô"
              variant="success"
            />
          )}
        </>,
        <CustomInput
          className="text-xs"
          width="120px"
          placeholder="vd : MP01-20251119-01"
          type="text"
          disabled={!row.newBatch}
          value={row.batchCode}
          onChange={(e) =>
            handleInputChange(row.id, "batchCode", e.target.value)
          }
        />,
        <span className="font-bold text-black">{row.assetCode}</span>,
        row.assetName,
        <CustomInput
          className="text-xs"
          width="120px"
          type="number"
          value={row.cost}
          onChange={(e) =>
            handleInputChange(row.id, "cost", Number(e.target.value))
          }
        />,
        <CustomInput
          className="text-xs"
          width="50px"
          type="number"
          value={row.quantity}
          onChange={(e) =>
            handleInputChange(row.id, "quantity", Number(e.target.value))
          }
        />,
        <CustomInput
          className="text-xs"
          width="120px"
          type="date"
          disabled={!row.newBatch}
          value={row.manufactureDate}
          onChange={(e) =>
            handleInputChange(row.id, "manufactureDate", e.target.value)
          }
        />,
        <CustomInput
          className="text-xs"
          width="120px"
          type="date"
          disabled={!row.newBatch}
          value={row.maintenanceDue}
          onChange={(e) =>
            handleInputChange(row.id, "maintenanceDue", e.target.value)
          }
        />,
        <CustomInput
          className="text-xs"
          width="120px"
          type="date"
          disabled={!row.newBatch}
          value={row.expirationDate}
          onChange={(e) =>
            handleInputChange(row.id, "expirationDate", e.target.value)
          }
        />,
      ])}
    />
  );
}
