import { useNavigate } from "react-router-dom";
import CustomTable from "../../components/common/custom-table";
import CustomIcon from "../../components/common/custom-icon";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useClasses } from "../../queries/class.query";
import { FaEye } from "react-icons/fa";
import ClassFilter from "./class-filter";

const columns = [
  "STT",
  "Tên lớp học",
  "Mã lớp học",
  "Số lượng học viên",
  "Thao tác",
];

export default function CommanderClassesTable() {
  const navigate = useNavigate();
  const { params, setParams } = usePaginationParams<PaginationDto & { keyword?: string }>();
  const { classes, isLoading } = useClasses(params);

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500 font-semibold">Đang tải danh sách lớp học...</div>;
  }

  return (
    <CustomTable
      onPageChange={handlePagination}
      title="Danh sách lớp quản lý trong hệ"
      filter={<ClassFilter />}
      columns={columns}
      currentPage={params.page}
      totalPages={classes?.totalPages}
      data={
        classes?.items.map((c: any, index: number) => [
          index + 1,
          c.name,
          c.code,
          `${c.student_count || 0} học viên`,
          <div className="flex items-center gap-2" key={c.id}>
            <CustomIcon
              onClick={() => {
                navigate(`/Student/List?class_id=${c.id}`);
              }}
              label="Xem danh sách học viên"
              icon={<FaEye size={20} className="text-blue-600" />}
            />
          </div>
        ]) || []
      }
    />
  );
}
