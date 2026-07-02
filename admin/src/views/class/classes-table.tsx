import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import { BiEdit } from "react-icons/bi";
import { useModalProvider } from "../../providers/modal-provider";

import UpdateClassModal from "./modals/update-class-modal";

import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useClasses, useDeleteClass } from "../../queries/class.query";
import { format } from "date-fns";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import ClassFilter from "../student/class-filter";

const columns = [
  "STT",
  "Thuộc hệ",
  "Mã lớp",
  "Tên lớp",
  "Ngày tạo",
  "Thao tác",
];

export default function ClassesTable() {
  const { openModal, openConfirmModal } = useModalProvider();
  const { params, setParams } = usePaginationParams<PaginationDto & { keyword?: string; major_id?: number }>();
  const { classes } = useClasses(params);
  const { mutate: deleteClass } = useDeleteClass();

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  const handleDelete = (id: number) => {
    openConfirmModal({
      title: "Xác nhận xóa lớp học",
      message: "Bạn có chắc chắn muốn xóa lớp học này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      onConfirm: () => {
        deleteClass(id, {
          onSuccess: () => {
            toast.success("Xóa lớp thành công");
          },
          onError: () => {
            toast.error("Không thể xóa lớp, có thể lớp này đang có sinh viên.");
          }
        });
      }
    });
  };

  return (
    <>
      <CustomTable
        onPageChange={handlePagination}
        title="Danh sách lớp"
        filter={<ClassFilter showMajor />}
        columns={columns}
        currentPage={params.page}
        totalPages={classes?.totalPages}
        data={
          classes?.items.map((s: any, index: number) => [
            index + 1,
            s.major_name,
            s.code,
            s.name,
            format(new Date(s.created_at), "dd/MM/yyyy"),
            <>
              <CustomIcon
                onClick={() => {
                  openModal(UpdateClassModal, { classId: s.id });
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
