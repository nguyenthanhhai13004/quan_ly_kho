import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import CustomBadge from "../../components/common/custom-badge";
import { BiEdit } from "react-icons/bi";
import { useModalProvider } from "../../providers/modal-provider";

import UpdateStudentModal from "./modals/update-student-modal";

import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useStudents, useDeleteStudent, useResetPasswordStudent, useUpdateStudent } from "../../queries/student.query";
import { MdDelete, MdBlock } from "react-icons/md";
import { RiResetLeftFill } from "react-icons/ri";
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
  const { mutate: resetPassword } = useResetPasswordStudent();
  const { mutate: updateStudent } = useUpdateStudent();

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

  const handleResetPassword = (id: number) => {
    openConfirmModal({
      title: "Đặt lại mật khẩu",
      message: "Bạn có chắc chắn muốn đặt lại mật khẩu cho học viên này?",
      confirmText: "Đặt lại",
      cancelText: "Hủy",
      onConfirm: () => {
        resetPassword(id, {
          onSuccess: () => {
            toast.success("Đặt lại mật khẩu thành công");
          }
        });
      }
    });
  };

  const handleChangeActive = (id: number, currentActive: boolean) => {
    updateStudent({ id, data: { is_active: !currentActive } });
  };

  return (
    <>
      <CustomTable
        onPageChange={handlePagination}
        title="Danh sách học viên"
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
                onClick={() => handleResetPassword(s.id)}
                label="Đặt lại mật khẩu"
                icon={<RiResetLeftFill size={20} />}
              />
              <CustomIcon
                onClick={() => handleChangeActive(s.id, s.is_active)}
                label={s.is_active ? "Khóa tài khoản" : "Mở khóa TK"}
                icon={<MdBlock size={20} />}
              />
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
