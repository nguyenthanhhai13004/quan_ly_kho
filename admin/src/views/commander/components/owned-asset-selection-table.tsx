import { useState } from "react";
import CustomTable from "../../../components/common/custom-table";
import { useAssetsOwn } from "../../../queries/warehouse.query";
import getImgSrc from "../../../utils/get-img-src";
import CustomIcon from "../../../components/common/custom-icon";
import { BiPlus } from "react-icons/bi";
import { useAdvisorRequestStore } from "../../../stores/advisor-request-store";
import CustomInput from "../../../components/common/custom-input";

export default function OwnedAssetSelectionTable() {
  const { assets, isLoading } = useAssetsOwn();
  const { addSelectedAsset } = useAdvisorRequestStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const columns = ["STT", "Mã", "Tên", "Ảnh", "Danh mục", "Đang sở hữu", "Thêm"];

  const filteredAssets = assets?.filter((asset: any) => 
    asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <CustomTable
        columns={columns}
        filter={
          <div className="p-2 flex gap-2 w-full max-w-xs">
            <CustomInput
              placeholder="Tìm kiếm mã hoặc tên..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="text-xs"
            />
          </div>
        }
        title="Chọn tài sản đang sở hữu"
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        data={
          paginatedAssets.map((asset: any, index: number) => {
            const totalOwnedQuantity = asset.batches.reduce(
              (sum: number, batch: any) => sum + Number(batch.quantity || 0),
              0
            );
            const itemIndex = (currentPage - 1) * itemsPerPage + index + 1;
            return [
              itemIndex,
              asset?.asset_code,
              asset?.asset_name,
              <div className="w-10 h-10" key={`img-${itemIndex}`}>
                <img
                  className="w-full h-full object-cover rounded"
                  src={getImgSrc(asset?.asset_image_url || "")}
                  alt={asset?.asset_name}
                />
              </div>,
              asset?.category?.name,
              <span className="font-semibold text-blue-600" key={`owned-${itemIndex}`}>
                {totalOwnedQuantity}
              </span>,
              <CustomIcon
                key={`add-${itemIndex}`}
                icon={<BiPlus size={20} />}
                label="Thêm vào yêu cầu"
                onClick={() => addSelectedAsset({
                  id: asset.id,
                  code: asset.asset_code,
                  name: asset.asset_name
                })}
                variant="info"
              />,
            ];
          })
        }
      />
    </div>
  );
}
