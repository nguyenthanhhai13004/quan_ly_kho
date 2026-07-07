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
  // params giữ page/size và các điều kiện lọc đang áp dụng cho API.
  const { params, setParams } = usePaginationParams<PaginationDto & { keyword?: string; status?: number; type?: number }>();
  // Gọi API lấy danh sách yêu cầu của Chỉ huy theo params hiện tại.
  const { requests, isLoading } = useMyAdvisorRequests(params);

  // Khi đổi trang, giữ nguyên bộ lọc hiện tại và chỉ thay page.
  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  // Mở modal để Chỉ huy tạo yêu cầu cấp phát/thu hồi mới.
  const handleOpenCreateModal = () => {
    openModal(CreateAdvisorRequestModal, {});
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500 font-semibold">Đang tải lịch sử yêu cầu...</div>;
  }

  // Gom các dòng tài sản thuộc cùng một yêu cầu ban đầu thành 1 dòng trên bảng.
  const groupedRequests = requests?.items
    ? Object.values(
        requests.items.reduce((acc: any, curr: any) => {
          // Không đưa status/phản hồi/người xử lý vào key, nếu không duyệt từng tài sản sẽ bị tách đơn.
          const key = `${curr.created_at}_${curr.type}_${curr.note || ""}`;
          if (!acc[key]) {
            // Tạo khung dữ liệu cho một đơn yêu cầu mới trong nhóm.
            acc[key] = {
              created_at: curr.created_at,
              type: curr.type,
              note: curr.note,
              items: [],
            };
          }
          // Mỗi item là một tài sản nằm trong cùng đơn yêu cầu.
          acc[key].items.push({
            asset_id: curr.asset_id,
            asset_code: curr.asset_code,
            asset_name: curr.asset_name,
            quantity: curr.quantity,
            status: curr.status,
            response_note: curr.response_note,
            processed_by_user_name: curr.processed_by_user_name,
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
          label="Tạo yêu cầu mới"
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
          // Mỗi mảng con tương ứng với một dòng của CustomTable.
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
            <div className="flex flex-col gap-1.5" key={`status-${index}`}>
              {/* Hiển thị trạng thái riêng của từng tài sản trong cùng đơn. */}
              {r.items.map((item: any, idx: number) => (
                <div key={idx} className="min-h-7 flex items-center">
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>,
            <div className="flex flex-col gap-1.5" key={`resp-${index}`}>
              {/* Phản hồi từ kho cũng đi theo từng tài sản, không phải theo cả đơn. */}
              {r.items.map((item: any, idx: number) => (
                <p
                  className="min-h-7 text-sm italic max-w-[200px] truncate"
                  title={item.response_note || ""}
                  key={idx}
                >
                  {item.response_note || "---"}
                </p>
              ))}
            </div>,
            <div className="flex flex-col gap-1.5" key={`processed-${index}`}>
              {r.items.map((item: any, idx: number) => (
                <span key={idx} className="min-h-7 text-sm flex items-center">
                  {item.processed_by_user_name || "---"}
                </span>
              ))}
            </div>,
          ])
        }
      />
    </>
  );
}
