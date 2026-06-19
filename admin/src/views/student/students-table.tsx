import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import CustomBadge from "../../components/common/custom-badge";
import { BiEdit } from "react-icons/bi";
import { useModalProvider } from "../../providers/modal-provider";

import UpdateStudentModal from "./modals/update-student-modal";
import StudentFilter from "./student-filter";

import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useStudents, useDeleteStudent } from "../../queries/student.query";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const columns = [
  "STT",
  "Thuộc lớp",
  "Mã học viên",
  "Họ và tên",
  "Email",
  "Trạng thái",
  "Thao tác",
];

export default function StudentsTable() {
  const { openModal, openConfirmModal } = useModalProvider();
  const { params, setParams } = usePaginationParams<PaginationDto & { keyword?: string; class_id?: number; active?: number }>();
  const { students } = useStudents(params);
  const { mutate: deleteStudent } = useDeleteStudent();

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  const handleDelete = (id: number) => {
    openConfirmModal({
      title: "Xác nhận xóa học viên",
      message: "Bạn có chắc chắn muốn xóa học viên này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      onConfirm: () => {
        deleteStudent(id, {
          onSuccess: () => {
            toast.success("Xóa học viên thành công");
          },
          onError: () => {
            toast.error("Không thể xóa học viên này.");
          }
        });
      }
    });
  };

  return (
    <>
      <CustomTable
        onPageChange={handlePagination}
        title="Danh sách học viên"
        filter={<StudentFilter />}
        columns={columns}
        currentPage={params.page}
        totalPages={students?.totalPages}
        data={
          students?.items.map((s: any, index: number) => [
            index + 1,
            s.class_name,
            s.student_code,
            s.fullname,
            s.email,
            <CustomBadge
              label={s.is_active ? "Đang hoạt động" : "Không hoạt động"}
              status={s.is_active ? "success" : "error"}
            />,
            <>
              <CustomIcon
                onClick={() => {
                  openModal(UpdateStudentModal, { studentId: s.id });
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
