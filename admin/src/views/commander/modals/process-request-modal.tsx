import { useEffect, useState } from "react";
import CustomModal from "../../../components/common/custom-modal";
import CustomButton from "../../../components/common/custom-button";
import { toast } from "react-toastify";
import { useProcessAdvisorRequest, useFulfillRecallRequest } from "../../../queries/advisor-request.query";
import { MdOutlineBatchPrediction, MdWarning } from "react-icons/md";
import AssetInWarehouseTable from "../../warehouse/asset-in-warehouse-table";
import AllocationAssetForm from "../../allocations-asset/allocation-asset-form";
import ImportAssetsView from "../../import-assets";
import { useQueryClient } from "@tanstack/react-query";
import { useAssetStock } from "../../../queries/warehouse.query";
import { getWarehouseId, setWarehouseId } from "../../../utils/storage";
import Cookies from "js-cookie";
import { useAppStore } from "../../../stores/app-store";
import TransactionApi from "../../../api/transactions-api";
import CustomInput from "../../../components/common/custom-input";
import dayjs from "dayjs";
import CustomTable from "../../../components/common/custom-table";
import CustomBadge from "../../../components/common/custom-badge";

export default function ProcessRequestModal({
  open,
  onClose,
  requestId,
  requestInfo,
  requestGroup,
}: {
  open: boolean;
  onClose: () => void;
  requestId?: number;
  requestInfo?: {
    advisor_id?: number;
    asset_id?: number;
    asset_code?: string;
    asset_name?: string;
    type?: number;
    quantity?: number;
    note?: string;
  };
  requestGroup?: {
    created_at: string;
    advisor_name?: string;
    class_name?: string;
    type: number;
    note?: string;
    items: any[];
  };
}) {
  const [mode, setMode] = useState<"view" | "reject" | "process">("view");
  const [responseNote, setResponseNote] = useState("");
  const [allocationTransactions, setAllocationTransactions] = useState<any[]>([]);
  const [loadingTxns, setLoadingTxns] = useState(false);
  const [activeRecallCode, setActiveRecallCode] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );

  const { mutate: processRequest, isPending: isProcessing } = useProcessAdvisorRequest();
  const { mutate: fulfillRecall, isPending: isFulfillingRecall } = useFulfillRecallRequest();

  const queryClient = useQueryClient();
  const { setWarehouseSelectedName } = useAppStore();
  const { stock } = useAssetStock(requestInfo?.asset_id);
  const currentWhId = getWarehouseId();

  // Find stock in current warehouse
  const currentWhStock = stock?.find((s) => s.warehouse_id === currentWhId);
  const currentWhQty = currentWhStock ? currentWhStock.total_quantity : 0;
  const isAllocation = requestInfo?.type === 1;
  const hasEnoughStock = !isAllocation || currentWhQty >= (requestInfo?.quantity || 0);



  useEffect(() => {
    if (open && requestGroup?.items && requestInfo?.type === 2) {
      const codes = Array.from(
        new Set(
          requestGroup.items
            .map((item: any) => item.allocation_transaction_code)
            .filter(Boolean)
        )
      ) as string[];

      if (codes.length > 0) {
        setLoadingTxns(true);
        Promise.all(
          codes.map((code) =>
            TransactionApi.getDetailTransaction(code)
              .then((res) => res.data)
              .catch((err) => {
                console.error(err);
                return null;
              })
          )
        )
          .then((results) => {
            setAllocationTransactions(results.filter(Boolean));
          })
          .finally(() => {
            setLoadingTxns(false);
          });
      } else {
        setAllocationTransactions([]);
      }
    }
  }, [open, requestGroup, requestInfo]);

  const handleFulfillRecall = () => {
    if (!returnDate) {
      toast.error("Vui lòng chọn ngày thu hồi");
      return;
    }

    const transactionCodes = Array.from(
      new Set(
        requestGroup?.items
          ?.map((item: any) => item.allocation_transaction_code)
          .filter(Boolean)
      )
    ) as string[];

    const requestIds = requestGroup?.items?.map((item: any) => item.id) || [];

    if (transactionCodes.length === 0) {
      toast.error("Không tìm thấy mã cấp phát nào để thu hồi");
      return;
    }

    // Format return_date to include time
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0]; // HH:MM:SS
    const formattedReturnDate = `${returnDate} ${timeStr}`;

    fulfillRecall(
      {
        id: requestId || requestIds[0],
        data: {
          transaction_codes: transactionCodes,
          return_date: formattedReturnDate,
          request_ids: requestIds,
          response_note: responseNote,
        },
      },
      {
        onSuccess: () => {
          toast.success("Thu hồi và duyệt yêu cầu thành công");
          resetAndClose();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
        },
      }
    );
  };

  const handleFulfillSingleRecall = (code: string) => {
    if (!returnDate) {
      toast.error("Vui lòng chọn ngày thu hồi");
      return;
    }

    const itemsForTxn = requestGroup?.items?.filter(
      (item: any) => item.allocation_transaction_code === code
    ) || [];

    const requestIdsForTxn = itemsForTxn.map((item: any) => item.id);

    if (requestIdsForTxn.length === 0) {
      toast.error("Không tìm thấy yêu cầu hợp lệ liên quan đến đơn cấp phát này");
      return;
    }

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0]; // HH:MM:SS
    const formattedReturnDate = `${returnDate} ${timeStr}`;

    setActiveRecallCode(code);

    fulfillRecall(
      {
        id: requestIdsForTxn[0],
        data: {
          transaction_codes: [code],
          return_date: formattedReturnDate,
          request_ids: requestIdsForTxn,
          response_note: responseNote,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Thu hồi đơn ${code} thành công`);
          setAllocationTransactions((prev) =>
            prev.map((t) =>
              t.code === code ? { ...t, return_date: formattedReturnDate } : t
            )
          );
          setActiveRecallCode(null);

          const updatedTransactions = allocationTransactions.map((t) =>
            t.code === code ? { ...t, return_date: formattedReturnDate } : t
          );
          
          const hasRemainingUnprocessedValid = updatedTransactions.some(
            (t) => !t.return_date && t.warehouse_id === currentWhId
          );

          if (!hasRemainingUnprocessedValid) {
            resetAndClose();
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Có lỗi xảy ra");
          setActiveRecallCode(null);
        },
      }
    );
  };

  const resetAndClose = () => {
    setMode("view");
    setResponseNote("");
    onClose();
  };

  const handleReject = () => {
    if (!responseNote) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    if (requestId) {
      processRequest(
        { id: requestId, data: { status: 2, response_note: responseNote } },
        {
          onSuccess: () => {
            toast.success("Đã từ chối yêu cầu");
            resetAndClose();
          },
          onError: (err: any) => toast.error(err?.response?.data?.message || "Có lỗi xảy ra"),
        }
      );
    }
  };

  const handleApproveStandard = () => {
    if (requestInfo?.type === 4 && !responseNote.trim()) {
      toast.error("Vui lòng nhập ghi chú phản hồi để trả lời Chỉ huy");
      return;
    }

    if (requestId) {
      processRequest(
        { id: requestId, data: { status: 1, response_note: responseNote } },
        {
          onSuccess: () => {
            toast.success("Xử lý yêu cầu thành công");
            resetAndClose();
          },
          onError: (err: any) => toast.error(err?.response?.data?.message || "Có lỗi xảy ra"),
        }
      );
    }
  };

  // Embedded allocation form (type 1)
  const renderAllocationForm = () => {
    const filterIds = requestInfo?.asset_id ? [requestInfo.asset_id] : undefined;

    return (
      <div className="mt-4">
        <h4 className="font-semibold text-sm mb-2 text-blue-700">Tiến hành cấp phát tài sản cho Chỉ huy</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 h-[500px]">
          <div className="col-span-1 lg:col-span-2 bg-gray-200 p-2 rounded-2xl h-full overflow-hidden">
            <div className="bg-white p-2 rounded-2xl flex mb-3 gap-2 text-gray-500 text-xs">
              <p>Gợi ý : Chọn vào icon </p>
              <MdOutlineBatchPrediction size={20} className="text-blue-500" />
              <p> để xem và chọn danh sách lô hàng cần cấp phát</p>
            </div>
            <AssetInWarehouseTable isInModal showButtonBatches filterAssetIds={filterIds} />
          </div>
          <div className="col-span-1 bg-gray-200 p-4 pt-5 rounded-2xl h-full overflow-y-auto">
            <AllocationAssetForm
              onClose={resetAndClose}
              requestId={requestId}
              requestQuantity={requestInfo?.quantity}
              defaultReceiverId={requestInfo?.advisor_id}
            />
          </div>
        </div>
      </div>
    );
  };

  // Embedded import form (type 2)
  const renderRecallForm = () => {
    const totalTxnsCount = allocationTransactions.length;
    const wrongWhTxnsCount = allocationTransactions.filter(
      (t) => t.warehouse_id !== currentWhId
    ).length;

    const columns = [
      "STT",
      "Mã cấp phát",
      "Tài sản",
      "Kho gốc",
      "Người thực hiện",
      "Hạn thu hồi",
      "Trạng thái thu hồi",
      "Ngày cấp",
      "Ghi chú",
      "Thao tác"
    ];

    const tableData = allocationTransactions.map((t, index: number) => {
      const isWrongWarehouse = t.warehouse_id !== currentWhId;
      
      const stt = index + 1;
      
      const code = (
        <span className="font-semibold text-blue-600">
          {t.code}
        </span>
      );
      
      const assets = (
        <div className="flex flex-col gap-1">
          {t.asset_transaction_items?.map((asset: any) => (
            <p key={asset.batch_code} className="m-0 leading-tight">
              <strong>[{asset.asset_code}]</strong> {asset.asset_name} - SL: {asset.quantity}
            </p>
          ))}
        </div>
      );
      
      const warehouse = (
        <div className="flex items-center">
          <span className={`font-medium ${isWrongWarehouse ? "text-red-600 font-semibold" : "text-gray-700"}`}>
            {t.warehouse_name || `Kho #${t.warehouse_id}`}
          </span>
          {isWrongWarehouse && (
            <span className="ml-1.5 text-[9px] text-red-700 bg-red-100 border border-red-200 rounded px-1 py-0.5 font-semibold">
              Sai kho
            </span>
          )}
        </div>
      );
      
      const creator = (
        <span className="text-[#2b7dbc]">
          {t.created_by_user}
        </span>
      );
      
      const deadline = t.return_deadline
        ? dayjs(t.return_deadline).format("DD/MM/YYYY")
        : "Không thu hồi";
        
      const status = t.return_date ? (
        <CustomBadge label="Đã thu hồi" status="success" />
      ) : t.return_deadline && new Date(t.return_deadline) < new Date() ? (
        <CustomBadge label="Quá hạn thu hồi" status="error" />
      ) : (
        <CustomBadge label="Chưa thu hồi" status="info" />
      );
      
      const date = dayjs(t.allocation_date).format("DD/MM/YYYY");
      
      const note = (
        <span className="text-gray-500 max-w-[150px] truncate block" title={t.note || ""}>
          {t.note || "---"}
        </span>
      );
      
      const action = (
        <div className="text-center">
          {!t.return_date && !isWrongWarehouse ? (
            <button
              type="button"
              onClick={() => handleFulfillSingleRecall(t.code)}
              disabled={!returnDate || (isFulfillingRecall && activeRecallCode === t.code)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors"
            >
              {isFulfillingRecall && activeRecallCode === t.code ? "Đang xử lý..." : "Thu hồi"}
            </button>
          ) : isWrongWarehouse ? (
            <span className="text-gray-400 font-medium italic text-[11px]">Không khả dụng</span>
          ) : (
            <span className="text-green-600 font-semibold text-[11px]">Đã hoàn thành</span>
          )}
        </div>
      );

      return [
        stt,
        code,
        assets,
        warehouse,
        creator,
        deadline,
        status,
        date,
        note,
        action
      ];
    });

    return (
      <div className="mt-4 flex flex-col gap-4">
        <h4 className="font-semibold text-sm text-blue-700">
          Danh sách đơn cấp phát cần thu hồi
        </h4>

        {!loadingTxns && totalTxnsCount > 0 && wrongWhTxnsCount > 0 && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex flex-col gap-1.5 shadow-sm">
            <p className="font-semibold flex items-center gap-1.5 text-sm text-red-800">
              <MdWarning className="text-red-600 w-4 h-4" /> Cảnh báo sai lệch kho nhận hàng
            </p>
            <p className="leading-relaxed text-gray-700">
              {wrongWhTxnsCount === totalTxnsCount ? (
                "Tất cả đơn cấp phát không thuộc kho hiện tại bạn đang làm việc. Vui lòng chuyển sang đúng kho ban đầu để thực hiện thu hồi."
              ) : (
                "Một số đơn cấp phát không thuộc kho hiện tại. Bạn chỉ có thể thu hồi đơn lẻ các đơn thuộc kho của mình ở cột Thao tác dưới bảng."
              )}
            </p>
          </div>
        )}
        
        {loadingTxns ? (
          <div className="text-center py-6 text-sm text-gray-500">
            Đang tải thông tin giao dịch cấp phát...
          </div>
        ) : allocationTransactions.length === 0 ? (
          <div className="text-center py-6 text-sm text-red-500 font-medium bg-red-50 border border-red-200 rounded-lg">
            Không tìm thấy thông tin đơn cấp phát liên quan.
          </div>
        ) : (
          <CustomTable
            columns={columns}
            data={tableData}
            maxHeight="300px"
            size="small"
          />
        )}

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054]">
              Ngày thu hồi <span className="text-red-500">*</span>
            </label>
            <CustomInput
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#344054]">
              Ghi chú phản hồi
            </label>
            <textarea
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              rows={2}
              placeholder="Nhập ghi chú phản hồi..."
              className="border border-[#D0D5DD] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#4B5563] bg-[#F5F4F9]"
            />
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <CustomButton
            type="button"
            label="Thu hồi tất cả"
            variant="danger"
            size="sm"
            onClick={handleFulfillRecall}
            isLoading={isFulfillingRecall}
            disabled={allocationTransactions.length === 0 || !returnDate || wrongWhTxnsCount > 0 || allocationTransactions.every((t) => t.return_date)}
          />
        </div>
      </div>
    );
  };

  const getTitle = () => {
    if (mode === "reject") return "Từ chối yêu cầu";
    if (mode === "process") {
      if (requestInfo?.type === 1) return "Cấp phát tài sản";
      if (requestInfo?.type === 2) return "Thu hồi tài sản";
      return "Xử lý yêu cầu";
    }
    return "Xử lý yêu cầu từ Chỉ huy";
  };

  const getModalWidth = () => {
    if (mode === "process" && (requestInfo?.type === 1 || requestInfo?.type === 2)) {
      return "max-w-7xl w-[95vw]";
    }
    return "max-w-xl w-[95vw]";
  };

  return (
    <CustomModal onClose={resetAndClose} open={open} title={getTitle()} width={getModalWidth()}>
      <div className="flex flex-col gap-5 pt-3">
        {/* Info summary - only in view mode */}
        {mode === "view" && (
          <div className="flex flex-col gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Thông tin yêu cầu</h4>
              {requestInfo?.type === 4 ? (
                <div className="flex flex-col gap-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-500">Loại:</p>
                    <p className="font-semibold text-blue-600">Khác (Trao đổi thông tin)</p>
                  </div>
                  {requestInfo?.note && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-gray-500 mb-1">Nội dung trao đổi của Chỉ huy:</p>
                      <p className="font-medium p-3 bg-white border border-gray-100 rounded-lg whitespace-pre-wrap italic">
                        {requestInfo.note}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {requestInfo?.type === 2 ? (
                    <>
                      <p className="text-gray-500">Loại:</p>
                      <p className="font-semibold text-amber-600">Thu hồi</p>
                      <p className="text-gray-500">Mã đơn cấp phát:</p>
                      <p className="font-semibold text-blue-600">
                        {requestGroup?.items?.map((item: any) => item.allocation_transaction_code).filter(Boolean).join(", ") || "---"}
                      </p>
                      {loadingTxns ? (
                        <div className="col-span-2 text-center py-2 text-xs text-gray-500">
                          Đang tải chi tiết tài sản...
                        </div>
                      ) : allocationTransactions.length > 0 ? (
                        <>
                          <p className="text-gray-500 col-span-2 mt-2 pt-2 border-t border-gray-200 font-semibold">
                            Tài sản cần thu hồi:
                          </p>
                          <div className="col-span-2 mt-1 bg-white border border-gray-200 rounded-lg p-2.5 flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                            {allocationTransactions.map((t: any) => (
                              <div key={t.code} className="text-xs">
                                <p className="font-semibold text-blue-600 mb-1">Đơn {t.code}:</p>
                                <div className="pl-3 flex flex-col gap-1 text-gray-700">
                                  {t.asset_transaction_items?.map((asset: any) => (
                                    <p key={asset.batch_code}>
                                      • <strong>[{asset.asset_code}]</strong> {asset.asset_name} - SL: {asset.quantity} (Lô: {asset.batch_code})
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="col-span-2 text-center py-2 text-xs text-red-500 font-medium">
                          Không tìm thấy chi tiết tài sản của đơn cấp phát.
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500">Tài sản:</p>
                      <p className="font-medium">{requestInfo?.asset_name || "---"}</p>
                      <p className="text-gray-500">Mã TS:</p>
                      <p className="font-medium">{requestInfo?.asset_code || "---"}</p>
                      <p className="text-gray-500">Loại:</p>
                      <p className="font-medium">
                        {requestInfo?.type === 1 ? "Cấp phát" : "Khác"}
                      </p>
                      <p className="text-gray-500">Số lượng:</p>
                      <p className="font-medium">{requestInfo?.quantity || 0}</p>
                    </>
                  )}
                  {requestInfo?.note && (
                    <>
                      <p className="text-gray-500 col-span-2 mt-2 pt-2 border-t border-gray-200 font-semibold">Ghi chú từ Chỉ huy:</p>
                      <p className="font-medium italic col-span-2 pl-2 border-l-2 border-gray-300 text-gray-600 bg-gray-50 p-2 rounded">{requestInfo.note}</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {isAllocation && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-sm text-gray-700 mb-3">Kiểm tra tồn kho khả dụng</h4>
                
                <div className="mb-0">
                  {hasEnoughStock ? (
                    <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm flex items-center gap-2 font-medium">
                      <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Đủ điều kiện cấp phát (Tồn kho: <strong>{currentWhQty}</strong> / Yêu cầu: <strong>{requestInfo?.quantity || 0}</strong>)</span>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm flex items-center gap-2 font-medium">
                      <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                      <span>Không đủ tồn kho hiện tại (Tồn kho: <strong>{currentWhQty}</strong> / Yêu cầu: <strong>{requestInfo?.quantity || 0}</strong>)</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reject mode: response note required */}
        {mode === "reject" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#344054]">
              Lý do từ chối (Bắt buộc)
            </label>
            <textarea
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              rows={3}
              placeholder="Nhập lý do từ chối..."
              className="border border-[#D0D5DD] rounded-lg p-3 text-sm focus:outline-none focus:border-[#4B5563]"
            />
          </div>
        )}

        {/* Process mode: embedded forms for type 1 and 2 */}
        {mode === "process" && requestInfo?.type === 1 && renderAllocationForm()}
        {mode === "process" && requestInfo?.type === 2 && renderRecallForm()}
        {mode === "process" && requestInfo?.type === 4 && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#344054]">
              Ghi chú phản hồi / Trả lời Chỉ huy (Bắt buộc)
            </label>
            <textarea
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
              rows={4}
              placeholder="Nhập nội dung phản hồi thông tin..."
              className="border border-[#D0D5DD] rounded-lg p-3 text-sm focus:outline-none focus:border-[#4B5563]"
            />
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-2">
        {mode === "view" ? (
          <>
            <CustomButton type="button" label="Từ chối yêu cầu" variant="danger" size="sm" onClick={() => setMode("reject")} />
            <CustomButton
              type="button"
              label="Tiến hành xử lý"
              variant="info"
              size="sm"
              onClick={() => setMode("process")}
              disabled={!hasEnoughStock}
            />
          </>
        ) : mode === "process" && (requestInfo?.type === 1 || requestInfo?.type === 2) ? null : (
          <>
            <CustomButton type="button" label="Quay lại" variant="default" size="sm" onClick={() => setMode("view")} />
            {mode === "reject" && (
              <CustomButton
                type="button"
                label="Xác nhận từ chối"
                variant="danger"
                size="sm"
                onClick={handleReject}
                isLoading={isProcessing}
              />
            )}
            {/* For type 3 (Báo lỗi) and 4 (Khác), show standard approve button */}
            {mode === "process" && requestInfo?.type !== 1 && requestInfo?.type !== 2 && (
              <CustomButton
                type="button"
                label="Xác nhận xử lý"
                variant="info"
                size="sm"
                onClick={handleApproveStandard}
                isLoading={isProcessing}
              />
            )}
            {/* For type 1 & 2, the submit buttons are inside AllocationAssetForm / ImportManualForm */}
          </>
        )}
      </div>
    </CustomModal>
  );
}
