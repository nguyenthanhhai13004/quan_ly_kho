import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import CustomBadge from "../../components/common/custom-badge";
import { useModalProvider } from "../../providers/modal-provider";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useStudents, useResetPasswordStudent } from "../../queries/student.query";
import { useMe } from "../../queries/auth.query";
import { BiEdit } from "react-icons/bi";
import { RiResetLeftFill } from "react-icons/ri";
import UpdateStudentModal from "../student/modals/update-student-modal";
import { toast } from "react-toastify";
import StudentFilter from "../student/student-filter";

const columns = [
  "STT",
  "Mã học viên",
  "Họ và tên",
  "Email",
  "Số điện thoại",
  "Trạng thái",
  "Thao tác",
];

export default function CommanderStudentsView() {
  const { openModal, openConfirmModal } = useModalProvider();
  const { isLoading: isUserLoading } = useMe();
  const { params, setParams } = usePaginationParams<PaginationDto & { keyword?: string; class_id?: number }>();
  const { students, isLoading: isStudentsLoading } = useStudents(params);
  const { mutate: resetPassword } = useResetPasswordStudent();

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
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
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Đặt lại mật khẩu thất bại");
          }
        });
      }
    });
  };

  if (isUserLoading || isStudentsLoading) {
    return <div className="p-6 text-center text-gray-500 font-semibold">Đang tải danh sách học viên...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-semibold py-1">Học viên lớp quản lý</h2>
          <p className="text-sm text-gray-500">Danh sách học viên thuộc lớp bạn đang quản lý</p>
        </div>
      </div>

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
            s.student_code,
            s.fullname,
            s.email,
            s.phone_number || "---",
            <CustomBadge
              label={s.is_active ? "Đang hoạt động" : "Không hoạt động"}
              status={s.is_active ? "success" : "error"}
            />,
            <div className="flex items-center gap-2">
              <CustomIcon
                onClick={() => handleResetPassword(s.id)}
                label="Đặt lại mật khẩu"
                icon={<RiResetLeftFill size={20} className="text-amber-600" />}
              />
              <CustomIcon
                onClick={() => {
                  openModal(UpdateStudentModal, { studentId: s.id });
                }}
                label="Cập nhật tài khoản"
                icon={<BiEdit size={20} className="text-blue-600" />}
              />
            </div>
          ]) || []
        }
      />
    </>
  );
}
