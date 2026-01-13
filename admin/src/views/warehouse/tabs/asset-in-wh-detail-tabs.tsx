import dayjs from "dayjs";
import CustomBadge from "../../../components/common/custom-badge";
import CustomTable from "../../../components/common/custom-table";
import type { ICustomTab } from "../../../components/common/custom-tabs";
import CustomTabs from "../../../components/common/custom-tabs";
import { useAllBatchesByCode } from "../../../queries/transaction.query";
import { getAssetBadgeProps } from "../../../utils/get-asset-badge-props";
import AssetBatchesTable from "../../asset-batches/asset-batches-table";
import AssetAllocationsReturnTab from "./asset-allocations-return-tab";
import AssetDisposalsTab from "./asset-disposals-tab";
import AssetInfoTab from "./asset-info-tab";
import AssetMainentanceTab from "./asset-mainentance-tab";

type AssetInWHDetailTabsProps = {
  assetCode: string;
};
export default function AssetInWHDetailTabs({
  assetCode,
}: AssetInWHDetailTabsProps) {
  if (!assetCode) return;
  const { batches } = useAllBatchesByCode(assetCode);
  const tabs: ICustomTab[] = [
    {
      key: "asset-info",
      label: "Chi tiết tài sản",
      content: <AssetInfoTab assetCode={assetCode} />,
    },
    {
      key: "asset-batch-info",
      label: "Chi tiết ds lô hàng",
      content: (
        <>
          <CustomTable
            columns={[
              "Mã lô",
              "Số lượng",
              "Tình trạng",
              "Ngày sản xuất",
              "Hạn sử dụng",
              "Hạn bảo trì",
            ]}
            data={
              batches?.map((batch) => [
                batch.batch_code,
                batch.quantity,
                <CustomBadge {...getAssetBadgeProps(batch.status)} />,
                // dayjs(batch.manufacture_date).format("DD/MM/YYYY"),
                // dayjs(batch.expiration_date).format("DD/MM/YYYY"),
                // dayjs(batch.maintenance_due).format("DD/MM/YYYY"),
                 dayjs(batch.manufacture_date).isValid()
                ? dayjs(batch.manufacture_date).format("DD/MM/YYYY")
                : "N/A",
              dayjs(batch.expiration_date).isValid()
                ? dayjs(batch.expiration_date).format("DD/MM/YYYY")
                : "N/A",
              dayjs(batch.maintenance_due).isValid()
                ? dayjs(batch.maintenance_due).format("DD/MM/YYYY")
                : "N/A",
              ]) || []
            }
          />
        </>
      ),
    },
    {
      key: "asset-mantenance",
      label: "Lịch sử bảo trì",
      content: <AssetMainentanceTab assetCode={assetCode} />,
    },
    {
      key: "asset-allocations",
      label: "Cấp phát - Thu hồi",
      content: <AssetAllocationsReturnTab assetCode={assetCode} />,
    },
    {
      key: "asset-disposal",
      label: "Thanh lý",
      content: <AssetDisposalsTab assetCode={assetCode} />,
    },
  ];

  return <CustomTabs defaultActive="asset-info" tabs={tabs} />;
}
