import CustomTable from "../../components/common/custom-table";
import { BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import CustomIcon from "../../components/common/custom-icon";
import AssetFilter from "./asset-filter";
import { useModalProvider } from "../../providers/modal-provider";
import { useState } from "react";
import UpdateAssetModal from "./modals/update-asset-modal";
import { useDrawer } from "../../hooks/use-drawer";
import getImgSrc from "../../utils/get-img-src";
import { useTransactionStore } from "../../stores/transactions-store";
import type { PaginationAssetsDto } from "../../dtos/asset/pagination-assets.dto";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import { useAllAssets, useDeleteAsset } from "../../queries/asset.query";
import { toast } from "react-toastify";

type AssetsTableProps = {
  showButtonAdd?: boolean;
  isInModal?: boolean;
};

export default function AssetsTable({
  showButtonAdd = false,
  isInModal = false,
}: AssetsTableProps) {
  const { params, setPage, setFilters, filters } =
    usePaginationParams<PaginationAssetsDto>({
      useUrl: !isInModal,
    });
  const { assets } = useAllAssets(isInModal ? filters : params);
  const { closeModal } = useModalProvider();
  const [seleted, setSeleted] = useState<{
    assetId: number | null;
    assetCode: string | null;
  } | null>(null);
  const columns = ["STT", "Mã", "Tên", "Ảnh", "Danh mục", "Hoạt động"];
  const { addRowImport } = useTransactionStore();
  const { setCurrentModal, currentModal, openConfirmModal } =
    useModalProvider();
  const { mutate } = useDeleteAsset();
  const handleDelete = (assetId: number) => {
    openConfirmModal({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa tài sản này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(
          {
            assetId,
          },
          {
            onSuccess: ({ message }) => {
              toast.success(message, {
                progress: undefined,
                hideProgressBar: true,
                autoClose: 1000,
              });
            },
          },
        );
      },
    });
  };
  return (
    <>
      <CustomTable
        columns={columns}
        checkboxHeader={"Chọn tài sản"}
        filter={
          <AssetFilter onFiltersChange={isInModal ? setFilters : undefined} />
        }
        // onDrawer={toggleFilterDrawer}
        // isOpenDrawer={drawer === String(DrawerEnum.FILTER_DRAWER)}
        title="D/s tài sản"
        totalPages={Number(assets?.totalPages || 1)}
        currentPage={params.page}
        onPageChange={setPage}
        data={
          assets?.items.map((asset, index: number) => [
            index + 1 + (params.page - 1) * params.size,
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
                onClick={() =>
                  setSeleted({
                    assetCode: asset.code,
                    assetId: asset.id,
                  })
                }
                variant="info"
                icon={<BiEdit size={20} />}
                label="Chỉnh sửa tài sản"
              />
              <CustomIcon
                onClick={()=>handleDelete(asset.id)}
                variant="danger"
                icon={<BiTrash size={20} />}
                label="Xóa tài sản"
              />
              ,
              {showButtonAdd && (
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
              )}
            </>,
          ]) || []
        }
      />
      <UpdateAssetModal
        assetCode={seleted?.assetCode || null}
        assetId={seleted?.assetId || null}
        open={seleted != null}
        onClose={() => {
          setSeleted(null);
          closeModal();
        }}
      />
    </>
  );
}
