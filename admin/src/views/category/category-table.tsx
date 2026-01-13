import CustomTable from "../../components/common/custom-table";
import { BiEdit, BiTrash } from "react-icons/bi";
import CustomIcon from "../../components/common/custom-icon";
import { useModalProvider } from "../../providers/modal-provider";
import UpdateCategoryModal from "./modals/update-category-modal";
import { ModalEnum } from "../../constants/modals.constant";
import {
  useAllCategories,
  useDeleteCategory,
} from "../../queries/category.query";
import { useState } from "react";
import type { TCategory } from "../../types/category.type";
import { toast } from "react-toastify";
import CategoryFilter from "./category-filter";
import type { PaginationDto } from "../../common/dtos/pagination.dto";
import { usePaginationParams } from "../../hooks/use-pagination-params";

const columns = ["STT", "Mã", "Tên", "Mô tả", "Hoạt động"];

export default function CategoriesTable() {
  const {
      params,
      setPage
    } = usePaginationParams<PaginationDto & { keyword: string }>({});
  const { categories } = useAllCategories(params);
  const { setCurrentModal, currentModal, openConfirmModal } =
    useModalProvider();
  const [selected, setSelected] = useState<TCategory | null>(null);
  const { mutate } = useDeleteCategory();
  const handleDelete = (categoryId: number) => {
    openConfirmModal({
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa danh mục này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      onConfirm: () => {
        mutate(categoryId, {
          onSuccess: ({ message }) => {
            toast.success(message, {
              progress: undefined,
              hideProgressBar: true,
              autoClose: 1000,
            });
          },
        });
      },
    });
  };
  return (
    <>
      <CustomTable
        columns={columns}
        title="Danh sách danh mục"
        filter={<CategoryFilter/>}
        onPageChange={setPage}
        currentPage={categories?.page}
        data={
          categories?.items.map((category, index: number) => [
            index + 1,
            category.code,
            category.name,
            category.description,
            // category.color
            // <div className="flex items-center gap-2">
            //   {/* Ô màu */}
            //   <span
            //     className="inline-block w-20 h-5 rounded border"
            //     style={{
            //       backgroundColor: isValidHex(category.color || "")
            //         ? category.color
            //         : "#cccccc",
            //     }}
            //   ></span>
            // </div>,
            ,
            <>
              <CustomIcon
                onClick={() => {
                  setCurrentModal(ModalEnum.UPDATE_CATEGORY_MODAL);
                  setSelected(category);
                }}
                variant="info"
                icon={<BiEdit size={20} />}
                label="Chỉnh sửa tài sản"
              />
              <CustomIcon
                onClick={() => handleDelete(category.id)}
                variant="danger"
                icon={<BiTrash size={20} />}
                label="Xóa tài sản"
              />
            </>,
          ]) || []
        }
      />
      <UpdateCategoryModal
        category={selected}
        onClose={() => {
          setCurrentModal(ModalEnum.CLOSE_MODAL);
          setSelected(null);
        }}
        open={currentModal === ModalEnum.UPDATE_CATEGORY_MODAL}
      />
    </>
  );
}
