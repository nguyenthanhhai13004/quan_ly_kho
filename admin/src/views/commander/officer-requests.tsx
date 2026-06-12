import CustomTable from "../../components/common/custom-table";
import CustomBadge from "../../components/common/custom-badge";
import CustomIcon from "../../components/common/custom-icon";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useAllAdvisorRequests } from "../../queries/advisor-request.query";
import { useModalProvider } from "../../providers/modal-provider";
import ProcessRequestModal from "./modals/process-request-modal";
import { format } from "date-fns";
import { MdOutlineRateReview } from "react-icons/md";

function getTypeBadge(type: number) {
  switch (type) {
    case 1:
      return <CustomBadge label="Cấp phát" status="info" />;
    case 2:
      return <CustomBadge label="Thu hồi" status="warning" />;
    case 3:
      return <CustomBadge label="Báo lỗi" status="error" />;
    case 4:
      return <CustomBadge label="Khác" status="default" />;
    default:
      return <CustomBadge label="---" status="default" />;
  }
}

const columns = [
  "STT",
  "Ngày gửi",
  "Chỉ huy gửi",
  "Lớp",
  "Loại",
  "Tài sản",
  "Số lượng",
  "Ghi chú",
  "Trạng thái",
  "Thao tác",
];

export default function OfficerRequestsView() {
  const { openModal } = useModalProvider();
  const { params, setParams } = usePaginationParams<
    PaginationDto & { keyword?: string; status?: number; type?: number; class_id?: number }
  >();
  const { requests, isLoading } = useAllAdvisorRequests(params);

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  const handleProcess = (r: any) => {
    openModal(ProcessRequestModal, {
      requestId: r.id,
      requestInfo: {
        advisor_id: r.advisor_id,
        advisor_name: r.advisor_name,
        asset_id: r.asset_id,
        asset_code: r.asset_code,
        asset_name: r.asset_name,
        type: r.type,
        quantity: r.quantity,
        note: r.note,
      },
    });
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500 font-semibold">Đang tải danh sách yêu cầu cần duyệt...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-semibold py-1">Duyệt yêu cầu từ Chỉ huy</h2>
          <p className="text-sm text-gray-500">
            Xem và phê duyệt / từ chối các yêu cầu cấp phát, thu hồi, báo lỗi tài sản từ Chỉ huy lớp
          </p>
        </div>
      </div>

      <CustomTable
        onPageChange={handlePagination}
        title="Danh sách yêu cầu"
        columns={columns}
        currentPage={params.page}
        totalPages={requests?.totalPages}
        data={
          requests?.items.map((r: any, index: number) => [
            index + 1,
            format(new Date(r.created_at), "dd/MM/yyyy HH:mm"),
            r.advisor_name || "---",
            r.class_name || "---",
            getTypeBadge(r.type),
            <div>
              <p className="font-semibold text-gray-800">{r.asset_name}</p>
              <p className="text-xs text-gray-500">{r.asset_code}</p>
            </div>,
            <span className="font-bold">{r.quantity}</span>,
            <p className="text-sm italic max-w-[180px] truncate" title={r.note || ""}>
              {r.note || "---"}
            </p>,
            <CustomBadge
              label={r.status === 0 ? "Chờ duyệt" : r.status === 1 ? "Đã duyệt" : "Từ chối"}
              status={r.status === 0 ? "warning" : r.status === 1 ? "success" : "error"}
            />,
            r.status === 0 ? (
              <CustomIcon
                onClick={() => handleProcess(r)}
                label="Xử lý yêu cầu"
                icon={<MdOutlineRateReview size={20} className="text-blue-600" />}
              />
            ) : (
              <span className="text-xs text-gray-400">Đã xử lý</span>
            ),
          ]) || []
        }
      />
    </>
  );
}
