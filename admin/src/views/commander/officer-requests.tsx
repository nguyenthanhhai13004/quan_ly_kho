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
import { useState } from "react";
import { useAllClasses } from "../../queries/class.query";
import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import FilterWrapper from "../filter-wrapper";

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
  "Tài sản & SL",
  "Ghi chú",
  "Trạng thái",
  "Thao tác",
];

export default function OfficerRequestsView() {
  const { openModal } = useModalProvider();
  const { params, setParams } = usePaginationParams<
    PaginationDto & {
      keyword?: string;
      status?: number;
      type?: number;
      class_id?: number;
      start_date?: string;
      end_date?: string;
    }
  >();
  const { requests, isLoading } = useAllAdvisorRequests(params);
  const { classes } = useAllClasses();

  const [localFilters, setLocalFilters] = useState({
    type: params.type !== undefined ? String(params.type) : "",
    class_id: params.class_id !== undefined ? String(params.class_id) : "",
    start_date: params.start_date || "",
    end_date: params.end_date || "",
    keyword: params.keyword || "",
  });

  const handlePagination = (page: number) => {
    setParams({ ...params, page });
  };

  const handleSearch = () => {
    setParams({
      ...params,
      page: 1,
      type: localFilters.type ? Number(localFilters.type) : undefined,
      class_id: localFilters.class_id ? Number(localFilters.class_id) : undefined,
      start_date: localFilters.start_date || undefined,
      end_date: localFilters.end_date || undefined,
      keyword: localFilters.keyword || undefined,
    });
  };

  const handleReset = () => {
    setLocalFilters({
      type: "",
      class_id: "",
      start_date: "",
      end_date: "",
      keyword: "",
    });
    setParams({
      page: 1,
      size: params.size,
      type: undefined,
      class_id: undefined,
      start_date: undefined,
      end_date: undefined,
      keyword: undefined,
    });
  };

  const handleProcess = (item: any, group?: any) => {
    openModal(ProcessRequestModal, {
      requestId: item.id,
      requestGroup: group || { items: [item] },
      requestInfo: {
        advisor_id: item.advisor_id,
        asset_id: item.asset_id,
        asset_code: item.asset_code,
        asset_name: item.asset_name,
        type: item.type,
        quantity: item.quantity,
        note: item.note,
      },
    });
  };

  const handleProcessGroup = (group: any) => {
    openModal(ProcessRequestModal, {
      requestId: group.items[0]?.id,
      requestGroup: group,
      requestInfo: {
        advisor_id: group.items[0]?.advisor_id,
        type: group.type,
        note: group.note,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-semibold py-1">Duyệt yêu cầu từ Chỉ huy</h2>
            <p className="text-sm text-gray-500">
              Xem và phê duyệt / từ chối các yêu cầu cấp phát, thu hồi, báo lỗi tài sản từ Chỉ huy lớp
            </p>
          </div>
        </div>
        <div className="text-center text-gray-500 font-semibold py-10 bg-white rounded-2xl border">
          Đang tải danh sách yêu cầu cần duyệt...
        </div>
      </div>
    );
  }

  // Group requests by: created_at, advisor_id, type, note
  const groupedRequests = requests?.items
    ? Object.values(
        requests.items.reduce((acc: any, curr: any) => {
          const key = `${curr.created_at}_${curr.advisor_id}_${curr.type}_${curr.note || ""}`;
          if (!acc[key]) {
            acc[key] = {
              created_at: curr.created_at,
              advisor_name: curr.advisor_name,
              class_name: curr.class_name,
              type: curr.type,
              note: curr.note,
              items: [],
            };
          }
          acc[key].items.push({
            id: curr.id,
            advisor_id: curr.advisor_id,
            asset_id: curr.asset_id,
            asset_code: curr.asset_code,
            asset_name: curr.asset_name,
            quantity: curr.quantity,
            status: curr.status,
            note: curr.note,
            type: curr.type,
            allocation_transaction_code: curr.allocation_transaction_code,
          });
          return acc;
        }, {})
      )
    : [];

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
        filter={
          <FilterWrapper
            onSubmit={handleSearch}
            onReset={handleReset}
          >
            <CustomSelect
              label="Loại yêu cầu"
              labelType="top"
              placeholder="Tất cả loại"
              value={localFilters.type}
              onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value })}
              className="min-w-[130px]"
              customDropdown
              options={[
                { label: "Cấp phát", value: 1 },
                { label: "Thu hồi", value: 2 },
                { label: "Khác", value: 4 },
              ]}
            />

            <CustomSelect
              label="Lớp học"
              labelType="top"
              placeholder="Tất cả lớp"
              value={localFilters.class_id}
              onChange={(e) => setLocalFilters({ ...localFilters, class_id: e.target.value })}
              className="min-w-[130px]"
              searchable
              options={
                classes?.map((c) => ({
                  label: c.name,
                  value: c.id,
                })) || []
              }
            />

            <CustomInput
              type="date"
              label="Từ ngày"
              labelType="top"
              value={localFilters.start_date}
              onChange={(e) => setLocalFilters({ ...localFilters, start_date: e.target.value })}
              className="min-w-[130px]"
            />

            <CustomInput
              type="date"
              label="Đến ngày"
              labelType="top"
              value={localFilters.end_date}
              onChange={(e) => setLocalFilters({ ...localFilters, end_date: e.target.value })}
              className="min-w-[130px]"
            />

            <CustomInput
              placeholder="Tên, mã tài sản..."
              value={localFilters.keyword}
              onChange={(e) => setLocalFilters({ ...localFilters, keyword: e.target.value })}
              className="min-w-[150px]"
            />
          </FilterWrapper>
        }
        data={
          groupedRequests.map((r: any, index: number) => [
            index + 1,
            format(new Date(r.created_at), "dd/MM/yyyy HH:mm"),
            r.advisor_name || "---",
            r.class_name || "---",
            getTypeBadge(r.type),
            <div className="flex flex-col gap-2" key={`assets-${index}`}>
              {r.items.map((item: any, idx: number) => (
                r.type === 4 ? (
                  <span className="text-xs text-gray-500 italic font-medium" key={idx}>
                    Không chứa tài sản
                  </span>
                ) : (
                  <div key={idx} className="h-8 flex items-center gap-1.5 text-sm">
                    <span className="font-semibold text-gray-800">{item.asset_name}</span>
                    <span className="text-xs text-gray-500">({item.asset_code})</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                      x{item.quantity}
                    </span>
                  </div>
                )
              ))}
            </div>,
            <p className="text-sm italic max-w-[180px] truncate" title={r.note || ""} key={`note-${index}`}>
              {r.note || "---"}
            </p>,
            <div className="flex flex-col gap-2" key={`status-${index}`}>
              {r.items.map((item: any, idx: number) => (
                <div key={idx} className="h-8 flex items-center">
                  <CustomBadge
                    label={item.status === 0 ? "Chờ duyệt" : item.status === 1 ? "Đã duyệt" : "Từ chối"}
                    status={item.status === 0 ? "warning" : item.status === 1 ? "success" : "error"}
                  />
                </div>
              ))}
            </div>,
            <div className="flex flex-col gap-2" key={`actions-${index}`}>
              {r.type === 2 ? (
                r.items.some((item: any) => item.status === 0) ? (
                  <CustomIcon
                    onClick={() => handleProcessGroup(r)}
                    label="Xử lý thu hồi"
                    icon={<MdOutlineRateReview size={18} className="text-[#d15b47]" />}
                  />
                ) : (
                  <span className="text-xs text-gray-400 font-medium">Đã xử lý</span>
                )
              ) : (
                r.items.map((item: any, idx: number) => (
                  <div key={idx} className="h-8 flex items-center">
                    {item.status === 0 ? (
                      <CustomIcon
                        onClick={() => handleProcess(item, r)}
                        label="Xử lý"
                        icon={<MdOutlineRateReview size={18} className="text-blue-600" />}
                      />
                    ) : (
                      <span className="text-xs text-gray-400 font-medium">Đã xử lý</span>
                    )}
                  </div>
                ))
              )}
            </div>,
          ])
        }
      />
    </>
  );
}
