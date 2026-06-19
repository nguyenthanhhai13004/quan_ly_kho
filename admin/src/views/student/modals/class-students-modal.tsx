import { useState } from "react";
import CustomModal from "../../../components/common/custom-modal";
import CustomTable from "../../../components/common/custom-table";
import CustomBadge from "../../../components/common/custom-badge";
import { useStudents } from "../../../queries/student.query";

export default function ClassStudentsModal({
  open,
  onClose,
  classId,
  className,
}: {
  open: boolean;
  onClose: () => void;
  classId: number;
  className: string;
}) {
  const [page, setPage] = useState(1);
  const { students, isLoading } = useStudents({ class_id: classId, page, size: 10 });

  const columns = [
    "STT",
    "Mã học viên",
    "Họ và tên",
    "Email",
    "Số điện thoại",
    "Trạng thái",
  ];

  return (
    <CustomModal
      onClose={onClose}
      open={open}
      title={`Chi tiết học viên - Lớp ${className}`}
      width="max-w-5xl"
      height="max-h-[80vh]"
    >
      <div className="pt-2">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-semibold">
            Đang tải danh sách học viên...
          </div>
        ) : (
          <CustomTable
            onPageChange={setPage}
            title={`Danh sách học viên lớp ${className}`}
            columns={columns}
            currentPage={page}
            totalPages={students?.totalPages}
            data={
              students?.items.map((s: any, index: number) => [
                (page - 1) * 10 + index + 1,
                s.student_code,
                s.fullname,
                s.email,
                s.phone_number || "---",
                <CustomBadge
                  label={s.is_active ? "Đang hoạt động" : "Không hoạt động"}
                  status={s.is_active ? "success" : "error"}
                />,
              ]) || []
            }
          />
        )}
      </div>
    </CustomModal>
  );
}
