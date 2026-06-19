import CustomTable from "../../components/common/custom-table";
import CustomBadge from "../../components/common/custom-badge";
import CustomButton from "../../components/common/custom-button";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import type { PaginationDto } from "../../dtos/pagination.dto";
import { useMyAdvisorRequests } from "../../queries/advisor-request.query";
import { useModalProvider } from "../../providers/modal-provider";
import CreateAdvisorRequestModal from "./modals/create-advisor-request-modal";
import { format } from "date-fns";
import CommanderRequestsFilter from "./commander-requests-filter";

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

function getStatusBadge(status: number) {
  switch (status) {
    case 0:
      return <CustomBadge label="Chờ duyệt" status="warning" />;
    case 1:
      return <CustomBadge label="Đã duyệt" status="success" />;
    case 2:
      return <CustomBadge label="Từ chối" status="error" />;
    default:
      return <CustomBadge label="---" status="default" />;
  }
}

const columns = [
  "STT",
  "Ngày gửi",
  "Loại yêu cầu",
  "Tài sản",
  "Ghi chú / Lý do",
  "Trạng thái",
  "Phản hồi từ kho",
  "Người xử lý",
];

export default function CommanderRequestsView() {
  const { openModal } = useModalProvider();
  const { params, setParams } = usePaginationParams<PaginationDto & { keyword?: string; status?: number; type?: number }>();
  const { requests, isLoading } = useMyAdvisorRequests(params);

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  const handleOpenCreateModal = () => {
    openModal(CreateAdvisorRequestModal, {});
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500 font-semibold">Đang tải lịch sử yêu cầu...</div>;
  }

  // Group requests by: created_at, type, note, status, response_note, processed_by_user_name
  const groupedRequests = requests?.items
    ? Object.values(
        requests.items.reduce((acc: any, curr: any) => {
          const key = `${curr.created_at}_${curr.type}_${curr.note || ""}_${curr.status}_${curr.response_note || ""}_${curr.processed_by_user_name || ""}`;
          if (!acc[key]) {
            acc[key] = {
              created_at: curr.created_at,
              type: curr.type,
              status: curr.status,
              note: curr.note,
              response_note: curr.response_note,
              processed_by_user_name: curr.processed_by_user_name,
              items: [],
            };
          }
          acc[key].items.push({
            asset_id: curr.asset_id,
            asset_code: curr.asset_code,
            asset_name: curr.asset_name,
            quantity: curr.quantity,
          });
          return acc;
        }, {})
      )
    : [];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-semibold py-1">Yêu cầu cấp phát & thu hồi</h2>
          <p className="text-sm text-gray-500">Xem và theo dõi trạng thái các yêu cầu đã gửi cho Cán bộ kho</p>
        </div>
        <CustomButton
          label="+ Tạo yêu cầu mới"
          size="sm"
          onClick={handleOpenCreateModal}
        />
      </div>

      <CustomTable
        onPageChange={handlePagination}
        title="Lịch sử yêu cầu"
        filter={<CommanderRequestsFilter />}
        columns={columns}
        currentPage={params.page}
        totalPages={requests?.totalPages}
        data={
          groupedRequests.map((r: any, index: number) => [
            index + 1,
            format(new Date(r.created_at), "dd/MM/yyyy HH:mm"),
            getTypeBadge(r.type),
            <div className="flex flex-col gap-1.5" key={`assets-${index}`}>
              {r.items.map((item: any, idx: number) => (
                <div key={idx} className="text-sm flex items-center gap-1.5">
                  <span className="font-semibold text-gray-800">{item.asset_name}</span>
                  <span className="text-xs text-gray-500">({item.asset_code})</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                    x{item.quantity}
                  </span>
                </div>
              ))}
            </div>,
            <p className="text-sm italic max-w-[200px] truncate" title={r.note || ""} key={`note-${index}`}>
              {r.note || "---"}
            </p>,
            getStatusBadge(r.status),
            <p className="text-sm italic max-w-[200px] truncate" title={r.response_note || ""} key={`resp-${index}`}>
              {r.response_note || "---"}
            </p>,
            r.processed_by_user_name || "---",
          ])
        }
      />
    </>
  );
}
