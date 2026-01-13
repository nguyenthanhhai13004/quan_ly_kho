import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import { useDrawer } from "../../hooks/use-drawer";
import { DrawerEnum } from "../../constants/drawers.constant";
import { BsEye } from "react-icons/bs";
import getImgSrc from "../../utils/get-img-src";
import AssetStatusBadges from "./asset-status-badges";
import AssetFilter from "../asset/asset-filter";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import { type PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";
import { useAllAssetsInWH } from "../../queries/warehouse.query";
import { MdOutlineBatchPrediction } from "react-icons/md";
import { useState } from "react";
import { useModalProvider } from "../../providers/modal-provider";
import AssetBatchesModal from "../asset-batches/asset-batches-modal";
import { ModalEnum } from "../../constants/modals.constant";
import AssetInWHDetailModal from "./modals/asset-in-wh-detail-modal";

type AssetInWarehouseTableProps = {
  showButtonBatches?: boolean;
  isInModal?: boolean;
};

export default function AssetInWarehouseTable({
  showButtonBatches,
  isInModal = false,
}: AssetInWarehouseTableProps) {
  const { params, setPage, setFilters, filters } =
    usePaginationParams<PaginationAssetsDto>({
      useUrl: !isInModal,
    });
  const { assets } = useAllAssetsInWH(isInModal ? filters : params);
  const { toggleFilterDrawer, drawer } = useDrawer();
  const [seleted, setSelected] = useState<{
    assetCode: string;
    assetName: string;
  } | null>(null);
  const { currentModal, setCurrentModal, closeModal } = useModalProvider();
  const columns = [
    "STT",
    "Mã",
    "Tên",
    "Ảnh",
    "Danh mục",
    "Tình trạng",
    "Hoạt động",
  ];
  return (
    <>
      <CustomTable
        columns={columns}
        onDrawer={toggleFilterDrawer}
        isOpenDrawer={drawer === String(DrawerEnum.FILTER_DRAWER)}
        filter={
          <AssetFilter onFiltersChange={isInModal ? setFilters : undefined} />
        }
        totalPages={assets?.totalPages}
        currentPage={params.page}
        onPageChange={setPage}
        data={
          assets?.items.map((asset, index: number) => [
            index + 1,
            asset?.asset_code,
            asset?.asset_name,
            <div className="w-10 h-10">
              <img
                className="w-full h-full object-cover rounded"
                src={getImgSrc(asset?.image_url || "")}
                alt={asset?.asset_name}
              />
            </div>,
            asset?.category?.name,
            <AssetStatusBadges statuses={asset.status} />,
            <>
              <CustomIcon
                variant="default"
                icon={<BsEye size={20} />}
                label="Xem chi tiết"
                onClick={() => {
                  setSelected({
                    assetCode: asset?.asset_code,
                    assetName: asset?.asset_name,
                  });
                  setCurrentModal(ModalEnum.ASSET_IN_WH_DETAIL);
                }}
              />

              {showButtonBatches && (
                <CustomIcon
                  variant="info"
                  icon={<MdOutlineBatchPrediction size={20} />}
                  label="Xem ds lô hàng"
                  onClick={() => {
                    setSelected({
                      assetCode: asset?.asset_code,
                      assetName: asset?.asset_name,
                    });
                    setCurrentModal(ModalEnum.ASSET_DETAIL_BATCHES);
                  }}
                />
              )}
            </>,
          ]) || []
        }
      />
      <AssetInWHDetailModal
        open={ModalEnum.ASSET_IN_WH_DETAIL === currentModal}
        onClose={() => {
          setSelected(null);
          closeModal();
        }}
        assetCode={seleted?.assetCode || null}
      />
      <AssetBatchesModal
        assetName={seleted?.assetName}
        assetCode={seleted?.assetCode || null}
        open={ModalEnum.ASSET_DETAIL_BATCHES === currentModal}
        onClose={() => {
          setSelected(null);
          closeModal();
        }}
      />
    </>
  );
}
