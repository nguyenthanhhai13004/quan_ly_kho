import { useState } from "react";
import CustomTable from "../../../components/common/custom-table";
import { useAllocationOrdersOwn } from "../../../queries/warehouse.query";
import CustomIcon from "../../../components/common/custom-icon";
import { BiPlus } from "react-icons/bi";
import { useAdvisorRequestStore } from "../../../stores/advisor-request-store";
import CustomInput from "../../../components/common/custom-input";
import CustomModal from "../../../components/common/custom-modal";
import { format } from "date-fns";
import getImgSrc from "../../../utils/get-img-src";
import { MdVisibility } from "react-icons/md";
import { useMyAdvisorRequests } from "../../../queries/advisor-request.query";

export default function OwnedOrderSelectionTable() {
  const { classId, addSelectedAsset } = useAdvisorRequestStore();
  const { orders, isLoading } = useAllocationOrdersOwn(classId || undefined);
  const { requests } = useMyAdvisorRequests({ page: 1, size: 200 });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOrder, setDetailOrder] = useState<any | null>(null);
  const itemsPerPage = 5;

  const getRecallRequestStatus = (trxCode: string) => {
    if (!requests?.items) return null;
    const matchingReq = requests.items.find(
      (r: any) =>
        r.type === 2 &&
        r.allocation_transaction_code === trxCode &&
        (r.status === 0 || r.status === 1)
    );
    return matchingReq ? matchingReq.status : null;
  };

  const filteredOrders =
    orders?.filter(
      (order: any) =>
        !!order.return_deadline &&
        (order.transaction_code
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.transaction_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.items?.some(
          (item: any) =>
            item.asset_code
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            item.asset_name?.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    ) || [];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "---";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy");
    } catch {
      return "---";
    }
  };

  const orderColumns = [
    "STT",
    "Mã đơn",
    "Tên đơn",
    "Ngày cấp phát",
    "Hạn trả",
    "Thao tác",
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow h-full flex items-center justify-center text-gray-500 text-sm">
        Đang tải danh sách đơn hàng...
      </div>
    );
  }

  if (!classId) {
    return (
      <div className="bg-white rounded-lg shadow h-full flex items-center justify-center text-gray-500 text-sm">
        Vui lòng chọn Lớp học yêu cầu bên phải trước
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow h-full flex flex-col">
        <CustomTable
          columns={orderColumns}
          filter={
            <div className="p-2 flex gap-2 w-full max-w-xs">
              <CustomInput
                placeholder="Tìm mã đơn, tên tài sản..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="text-xs"
              />
            </div>
          }
          title="Đơn cấp phát đang sở hữu (chưa trả)"
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          data={paginatedOrders.map((order: any, index: number) => {
            const itemIndex = (currentPage - 1) * itemsPerPage + index + 1;
            const totalItems = order.items?.length || 0;

            const recallStatus = getRecallRequestStatus(order.transaction_code);
            const isRequested = recallStatus !== null;

            return [
              itemIndex,
              <div className="flex flex-col gap-0.5" key={`code-${order.transaction_id}`}>
                <span className="font-semibold text-blue-600 text-xs">
                  {order.transaction_code}
                </span>
                {recallStatus === 0 && (
                  <span className="text-[9px] text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 w-fit font-medium">
                    Chờ duyệt
                  </span>
                )}
                {recallStatus === 1 && (
                  <span className="text-[9px] text-green-600 bg-green-50 px-1 py-0.2 rounded border border-green-200 w-fit font-medium">
                    Đã thu hồi
                  </span>
                )}
              </div>,
              <span
                className="text-xs truncate max-w-[120px]"
                key={`name-${order.transaction_id}`}
                title={order.transaction_name}
              >
                {order.transaction_name || "---"}
              </span>,
              <span className="text-xs" key={`alloc-${order.transaction_id}`}>
                {formatDate(order.allocation_date)}
              </span>,
              <span
                className={`text-xs font-medium ${
                  order.return_deadline ? "text-red-600" : "text-gray-400"
                }`}
                key={`deadline-${order.transaction_id}`}
              >
                {formatDate(order.return_deadline)}
              </span>,
              <div className="flex gap-2.5" key={`actions-${order.transaction_id}`}>
                <CustomIcon
                  icon={<MdVisibility size={18} />}
                  label="Xem chi tiết"
                  onClick={() => setDetailOrder(order)}
                  variant="info"
                />
                {isRequested ? (
                  <CustomIcon
                    icon={<BiPlus size={18} />}
                    label={recallStatus === 0 ? "Đang yêu cầu" : "Đã thu hồi"}
                    onClick={() => {}}
                    variant="default"
                    disabled
                  />
                ) : (
                  <CustomIcon
                    icon={<BiPlus size={18} />}
                    label="Thêm cả đơn"
                    onClick={() => {
                      order.items?.forEach((item: any) => {
                        addSelectedAsset({
                          id: item.asset_id,
                          code: item.asset_code,
                          name: item.asset_name,
                          quantity: item.quantity,
                          allocation_transaction_code: order.transaction_code,
                        });
                      });
                    }}
                    variant="success"
                  />
                )}
              </div>,
            ];
          })}
        />
      </div>

      {/* Detail Modal */}
      <CustomModal
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        title={`Chi tiết đơn: ${detailOrder?.transaction_code || ""}`}
        width="max-w-3xl w-[90vw]"
        height="h-auto max-h-[70vh]"
      >
        {detailOrder && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded-lg">
              <div>
                <span className="text-gray-500">Mã đơn:</span>{" "}
                <span className="font-semibold">{detailOrder.transaction_code}</span>
              </div>
              <div>
                <span className="text-gray-500">Tên đơn:</span>{" "}
                <span className="font-semibold">{detailOrder.transaction_name || "---"}</span>
              </div>
              <div>
                <span className="text-gray-500">Ngày cấp phát:</span>{" "}
                <span className="font-semibold">{formatDate(detailOrder.allocation_date)}</span>
              </div>
              <div>
                <span className="text-gray-500">Hạn trả:</span>{" "}
                <span className={`font-semibold ${detailOrder.return_deadline ? "text-red-600" : ""}`}>
                  {formatDate(detailOrder.return_deadline)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Kho:</span>{" "}
                <span className="font-semibold">{detailOrder.warehouse_name}</span>
              </div>
            </div>

            <CustomTable
              columns={[
                "STT",
                "Mã TS",
                "Tên tài sản",
                "Ảnh",
                "Danh mục",
                "Lô hàng",
                "SL",
              ]}
              size="small"
              data={
                detailOrder.items?.map((item: any, idx: number) => [
                  idx + 1,
                  <span className="text-xs font-mono" key={`icode-${idx}`}>
                    {item.asset_code}
                  </span>,
                  <span
                    className="text-xs truncate max-w-[140px]"
                    key={`iname-${idx}`}
                    title={item.asset_name}
                  >
                    {item.asset_name}
                  </span>,
                  <div className="w-8 h-8" key={`iimg-${idx}`}>
                    <img
                      className="w-full h-full object-cover rounded"
                      src={getImgSrc(item.asset_image_url || "")}
                      alt={item.asset_name}
                    />
                  </div>,
                  <span className="text-xs" key={`icat-${idx}`}>
                    {item.category_name}
                  </span>,
                  <span className="text-xs font-mono" key={`ibatch-${idx}`}>
                    {item.batch_code}
                  </span>,
                  <span
                    className="font-semibold text-blue-600 text-xs"
                    key={`iqty-${idx}`}
                  >
                    {item.quantity}
                  </span>,
                ]) || []
              }
            />
          </div>
        )}
      </CustomModal>
    </>
  );
}
