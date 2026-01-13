import CustomTable from "../../components/common/custom-table";
import type { PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import { useAllAssets } from "../../queries/asset.query";
import { useTransactionStore } from "../../stores/transactions-store";
import AssetFilter from "../asset/asset-filter";
import getImgSrc from "../../utils/get-img-src";
import CustomIcon from "../../components/common/custom-icon";
import { BiPlus } from "react-icons/bi";
import { MdOutlineBatchPrediction } from "react-icons/md";
import CustomModal from "../../components/common/custom-modal";
import { useAllBatchesByCode } from "../../queries/transaction.query";
import { useState } from "react";
import { useModalProvider } from "../../providers/modal-provider";
import { ModalEnum } from "../../constants/modals.constant";
import CustomCheckbox from "../../components/common/custom-checkbox";
import CustomBadge from "../../components/common/custom-badge";
import { getAssetBadgeProps } from "../../utils/get-asset-badge-props";
import dayjs from "dayjs";

export default function AssetInModalTable() {
  const { setFilters, filters, setPageFilter } =
    usePaginationParams<PaginationAssetsDto>({
      useUrl: false,
    });
  const { assets } = useAllAssets(filters);
  const columns = ["STT", "Mã", "Tên", "Ảnh", "Danh mục", "Hoạt động"];
  const { addRowImport, importManualState } = useTransactionStore();
  const [seleted, setSelected] = useState<string | null>(null);
  const { batches } = useAllBatchesByCode(seleted);
  const { currentModal, setCurrentModal, closeModal } = useModalProvider();
  return (
    <>
      <CustomTable
        columns={columns}
        checkboxHeader={"Chọn tài sản"}
        filter={<AssetFilter onFiltersChange={setFilters} />}
        title="D/s tài sản"
        totalPages={assets?.totalPages}
        currentPage={filters.page}
        onPageChange={setPageFilter}
        data={
          assets?.items.map((asset, index: number) => [
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
            asset?.category?.name,
            <>
              <CustomIcon
                variant="default"
                icon={<BiPlus size={20} />}
                label="Thêm vào ds nhập kho"
                onClick={() =>
                  addRowImport({
                    code: asset.code,
                    name: asset.name,
                    id: asset.id,
                  })
                }
              />
              <CustomIcon
                variant="info"
                icon={<MdOutlineBatchPrediction size={20} />}
                label="Xem ds lô hàng"
                onClick={() => {
                  setSelected(asset.code);
                  setCurrentModal(ModalEnum.ASSET_DETAIL_BATCHES);
                }}
              />
            </>,
          ]) || []
        }
      />

      <CustomModal
        title="Danh sách lô hàng chi tiết"
        width="w-5xl"
        open={ModalEnum.ASSET_DETAIL_BATCHES === currentModal}
        onClose={() => {
          setSelected(null);
          closeModal();
        }}
      >
        <CustomTable
          columns={[
            "Chọn",
            "Mã lô",
            "Số lượng",
            "Tình trạng",
            "Ngày sản xuất",
            "Hạn sử dụng",
            "Hạn bảo trì",
          ]}
          data={
            batches?.map((batch) => [
              <CustomCheckbox
                disabled={batch.quantity == 0}
                checked={importManualState.selectedAssets.some(
                  (b) => b.batchCode === batch.batch_code,
                )}
                onChange={() => {
                  const assetFound = assets?.items.find(
                    (a) => a.id === batch.asset_id,
                  );
                  addRowImport({
                    id: assetFound?.id,
                    code: assetFound?.code,
                    name: assetFound?.name,
                    batchCode: batch.batch_code,
                  });
                }}
              />,
              batch.batch_code,
              batch.quantity,
              <CustomBadge {...getAssetBadgeProps(batch.status)} />,
              // dayjs(batch.manufacture_date).format("DD/MM/YYYY"),
              // dayjs(batch.expiration_date).format("DD/MM/YYYY"),
              // dayjs(batch.maintenance_due).format("DD/MM/YYYY"),
              // check format use invalid and display if null
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
      </CustomModal>
    </>
  );
}
