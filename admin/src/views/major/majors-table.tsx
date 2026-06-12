import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import { BiEdit } from "react-icons/bi";
import { useModalProvider } from "../../providers/modal-provider";

import UpdateMajorModal from "./modals/update-major-modal";

import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useMajors, useDeleteMajor } from "../../queries/major.query";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const columns = [
  "STT",
  "Mã hệ",
  "Tên hệ",
  "Mô tả",
  "Ngày tạo",
  "Thao tác",
];

export default function MajorsTable() {
  const { openModal, openConfirmModal } = useModalProvider();
  const { params, setParams } = usePaginationParams<PaginationDto & { keyword?: string }>();
  const { majors } = useMajors(params);
  const { mutate: deleteMajor } = useDeleteMajor();

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  const handleDelete = (id: number) => {
    openConfirmModal({
      title: "Xác nhận xóa hệ đào tạo",
      message: "Bạn có chắc chắn muốn xóa hệ đào tạo này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      onConfirm: () => {
        deleteMajor(id, {
          onSuccess: () => {
            toast.success("Xóa hệ thành công");
          },
          onError: () => {
            toast.error("Không thể xóa hệ, có thể hệ này đang chứa lớp.");
          }
        });
      }
    });
  };

  return (
    <>
      <CustomTable
        onPageChange={handlePagination}
        title="Danh sách hệ"
        columns={columns}
        currentPage={params.page}
        totalPages={majors?.totalPages}
        data={
          majors?.items.map((s: any, index: number) => [
            index + 1,
            s.code,
            s.name,
            s.description,
            format(new Date(s.created_at), "dd/MM/yyyy"),
            <>
              <CustomIcon
                onClick={() => {
                  openModal(UpdateMajorModal, { majorId: s.id });
                }}
                label="Chỉnh sửa thông tin"
                icon={<BiEdit size={20} />}
              />
              <CustomIcon
                onClick={() => handleDelete(s.id)}
                label="Xóa"
                icon={<MdDelete size={20} className="text-red-500" />}
              />
            </>,
          ]) || []
        }
      />

    </>
  );
}
