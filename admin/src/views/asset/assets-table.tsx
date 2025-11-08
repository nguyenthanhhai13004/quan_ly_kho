import CustomTable from "../../components/common/custom-table";
import CustomBadge from "../../components/common/custom-badge";
import { BiEdit, BiTrash } from "react-icons/bi";
import CustomIcon from "../../components/common/custom-icon";
import AssetFilter from "./asset-filter";
import { useAllAssets } from "../../hooks/asset/use-all-assets";
import dayjs from "dayjs";
import { getAssetBadgeProps } from "../../utils/get-asset-badge-props";
import { useAssetParams } from "../../hooks/asset/use-asset-params";

const columns = [
  "STT",
  "Mã",
  "Tên",
  "Danh mục",
  "Số lượng",
  "Tình trạng",
  "Ngày nhập",
  "Hạn bảo trì",
  "Hoạt động",
];

export default function AssetsTable() {
  const params = useAssetParams();
  const {assets} = useAllAssets(params);

  return (
    <CustomTable
      columns={columns}
      filter={<AssetFilter/>}
      title="D/s tài sản"
      totalPages={assets?.totalPages}
      data={
        assets?.items.map((asset, index: number) => [
          index + 1,
          asset.code,
          asset.name,
          asset.category.name,
          asset.quantity,
          <CustomBadge {...getAssetBadgeProps(asset.status)} className="min-w-[100px]"/>,
          dayjs(asset.import_date).format("DD/MM/YYYY HH:mm"),
          dayjs(asset.maintenance_due).format("DD/MM/YYYY HH:mm"),
          <>
            <CustomIcon variant="info" icon={<BiEdit size={20}/>} label="Chỉnh sửa tài sản"/>
            <CustomIcon variant="danger" icon={<BiTrash size={20}/>} label="Xóa tài sản"/>
          </>,
        ]) || []
      }
    />
  );
}
