import CustomTable from "../../../components/common/custom-table";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import { useAssetListAll } from "../../../queries/asset.query";
import getImgSrc from "../../../utils/get-img-src";
import CustomIcon from "../../../components/common/custom-icon";
import { BiPlus } from "react-icons/bi";
import { useAdvisorRequestStore } from "../../../stores/advisor-request-store";
import AssetFilter from "../../asset/asset-filter";
import type { PaginationAssetsDto } from "../../../dtos/asset/pagination-assets.dto";

export default function AssetSelectionTable() {
  const { setFilters, filters, setPageFilter } = usePaginationParams<PaginationAssetsDto>({
    useUrl: false,
  });
  const { assets } = useAssetListAll(filters);
  const { addSelectedAsset } = useAdvisorRequestStore();

  const columns = ["STT", "Mã", "Tên", "Ảnh", "Danh mục", "Thêm"];

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <CustomTable
        columns={columns}
        filter={<AssetFilter onFiltersChange={setFilters} inModal={true} />}
        // title="Chọn tài sản yêu cầu"
        totalPages={assets?.totalPages}
        currentPage={filters.page}
        onPageChange={setPageFilter}
        data={
          assets?.items.map((asset: any, index: number) => [
            index + 1,
            asset?.code,
            asset?.name,
            <div className="w-10 h-10">
              <img
                className="w-full h-full object-cover rounded"
                src={getImgSrc(asset?.image_url || "")}
                alt={asset?.name}
              />
            </div>,
            asset?.category?.name || asset?.category_name || "---",
            <CustomIcon
              key={`add-${index}`}
              icon={<BiPlus size={20} />}
              label="Thêm vào yêu cầu"
              onClick={() => addSelectedAsset(asset)}
              variant="info"
            />,
          ]) || []
        }
      />
    </div>
  );
}
