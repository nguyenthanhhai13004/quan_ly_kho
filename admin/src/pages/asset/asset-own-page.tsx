import { useState } from "react";
import ViewHeader from "../../views/view-header";
import { useAssetsOwn } from "../../queries/warehouse.query";
import CustomTable from "../../components/common/custom-table";
import CustomBadge from "../../components/common/custom-badge";
import CustomIcon from "../../components/common/custom-icon";
import dayjs from "dayjs";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { AssetStatusEnum } from "../../common/enums/asset-status.enum";
import getImgSrc from "../../utils/get-img-src";

function getStatusBadge(status: number) {
  if (status === AssetStatusEnum.GOOD)
    return <CustomBadge label="Tốt" status="success" />;
  if (status === AssetStatusEnum.BROKEN)
    return <CustomBadge label="Hỏng" status="error" />;
  if (status === AssetStatusEnum.MAINTENANCE)
    return <CustomBadge label="Bảo trì" status="warning" />;
  return <CustomBadge label="Khác" status="default" />;
}

export default function AssetOwnPage() {
  const { assets, isLoading } = useAssetsOwn();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (assetCode: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [assetCode]: !prev[assetCode],
    }));
  };

  if (isLoading) {
    return (
      <>
        <ViewHeader title="Tài sản đang sở hữu" />
        <div className="text-center p-6 text-gray-500 font-semibold">Đang tải danh sách tài sản...</div>
      </>
    );
  }

  const columns = [
    "STT",
    "Hình ảnh",
    "Mã tài sản",
    "Tên tài sản",
    "Danh mục",
    "Kho cấp phát",
    "Tổng SL đang giữ",
    "Chi tiết",
  ];

  // Build table data: for each asset, create main row + optional expanded detail rows
  const tableData: React.ReactNode[][] = [];

  (assets || []).forEach((asset: any, index: number) => {
    const isExpanded = expandedRows[asset.asset_code];
    const activeBatches = asset.batches.filter((b: any) => !b.return_date);
    const totalQuantity = activeBatches.reduce((sum: number, b: any) => sum + b.quantity, 0);

    // Main row
    tableData.push([
      index + 1,
      <img
        src={getImgSrc(asset.asset_image_url)} 
        alt={asset.asset_name}
        className="w-10 h-10 object-cover rounded-lg border border-gray-200"
      />,
      <span className="font-medium text-blue-600">{asset.asset_code}</span>,
      <span className="font-semibold">{asset.asset_name}</span>,
      asset.category?.name || "---",
      asset.warehouse_name || "---",
      <span className="font-bold">{totalQuantity}</span>,
      <CustomIcon
        icon={isExpanded ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
        label={isExpanded ? "Thu gọn" : "Xem lô hàng"}
        onClick={() => toggleRow(asset.asset_code)}
      />,
    ]);

    // Expanded detail rows
    if (isExpanded) {
      asset.batches.forEach((batch: any, bIndex: number) => {
        const isReturned = !!batch.return_date;
        tableData.push([
          "",
          "",
          <span className={`text-xs ${isReturned ? "text-gray-400 line-through" : "text-gray-700"}`}>
            {batch.batch_code}
          </span>,
          <span className={`text-xs ${isReturned ? "text-gray-400" : ""}`}>
            Lô #{bIndex + 1}
          </span>,
          getStatusBadge(batch.status),
          <span className="text-xs text-gray-500">
            {batch.expiration_date ? dayjs(batch.expiration_date).format("DD/MM/YYYY") : "Không HSD"}
          </span>,
          <span className={`text-xs font-semibold ${isReturned ? "text-gray-400" : "text-blue-600"}`}>
            {batch.quantity}
          </span>,
          isReturned ? (
            <CustomBadge label={`Đã thu hồi ${dayjs(batch.return_date).format("DD/MM/YYYY")}`} status="default" />
          ) : (
            <CustomBadge label="Đang sử dụng" status="success" />
          ),
        ]);
      });
    }
  });

  return (
    <>
      <ViewHeader title="Tài sản đang sở hữu" />
      <CustomTable
        title="Danh sách tài sản được cấp phát"
        columns={columns}
        data={tableData}
      />
    </>
  );
}