import CustomTable from "../../../components/common/custom-table";

type AssetInTransactionTableProps = {
  assets: {
    asset_code: string;
    asset_name: string;
    quantity: number;
    status?: number | string;
    [key: string]: any;
  }[];
  columns?: string[];
  showStatus?: boolean;
  showCost?: boolean;
  statusKey?: string;
  renderStatus?: (value: any) => React.ReactNode;
};

export default function AssetInTransactionTable({
  assets,
  columns = ["Mã", "Tên tài sản", "Số lượng"],
  showStatus = false,
  statusKey = "status",
  showCost,
  renderStatus,
}: AssetInTransactionTableProps) {
  const finalColumns = [
    ...columns,
    ...(showStatus ? ["Trạng thái khi về kho"] : []),
    ...(showCost ? ["Chi phí"] : []),
  ];

  const tableData = assets.map((asset) => {
    const row = [asset?.asset_code, asset?.asset_name, asset?.quantity];

    if (showStatus) {
      const rawStatus = asset[statusKey];
      row.push(renderStatus ? renderStatus(rawStatus) : (rawStatus ?? "—"));
    }

    if (showCost) {
      row.push(asset.cost ?? 0);
    }

    return row;
  });

  return <CustomTable columns={finalColumns} size="small" data={tableData} />;
}
