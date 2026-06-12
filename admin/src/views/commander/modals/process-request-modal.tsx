import { useState } from "react";
import CustomModal from "../../../components/common/custom-modal";
import CustomButton from "../../../components/common/custom-button";
import { toast } from "react-toastify";
import { useProcessAdvisorRequest } from "../../../queries/advisor-request.query";
import { MdOutlineBatchPrediction } from "react-icons/md";
import AssetBatchesTable from "../../asset-batches/asset-batches-table";
import AllocationAssetForm from "../../allocations-asset/allocation-asset-form";
import ImportAssetsView from "../../import-assets";
import { useTransactionStore } from "../../../stores/transactions-store";

export default function ProcessRequestModal({
  open,
  onClose,
  requestId,
  requestInfo,
}: {
  open: boolean;
  onClose: () => void;
  requestId: number;
  requestInfo?: {
    advisor_id?: number;
    advisor_name?: string;
    asset_id?: number;
    asset_code?: string;
    asset_name?: string;
    type?: number;
    quantity?: number;
    note?: string;
  };
}) {
  const [mode, setMode] = useState<"view" | "reject" | "process">("view");
  const [responseNote, setResponseNote] = useState("");

  const { mutate: processRequest, isPending: isProcessing } = useProcessAdvisorRequest();
  const { resetBatchState } = useTransactionStore();

  const resetAndClose = () => {
    setMode("view");
    setResponseNote("");
    resetBatchState();
    onClose();
  };

  // Bắt đầu xử lý: dọn sạch lô đã chọn từ lần trước để tránh lẫn tài sản
  const startProcess = () => {
    resetBatchState();
    setMode("process");
  };

  const handleReject = () => {
    if (!responseNote) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
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
  };

  const handleApproveStandard = () => {
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
  };

  // Embedded allocation form (type 1)
  const renderAllocationForm = () => {
    return (
      <div className="mt-4">
        <h4 className="font-semibold text-sm mb-2 text-blue-700">
          Tiến hành cấp phát tài sản cho Chỉ huy{" "}
          <span className="text-blue-900">{requestInfo?.advisor_name || "---"}</span>
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 h-[500px]">
          <div className="col-span-1 lg:col-span-2 bg-gray-200 p-2 rounded-2xl h-full overflow-y-auto">
            <div className="bg-white p-2 rounded-2xl flex mb-3 gap-2 text-gray-500 text-xs items-center">
              <MdOutlineBatchPrediction size={20} className="text-blue-500" />
              <p>
                Chọn các lô hàng của tài sản{" "}
                <b>{requestInfo?.asset_name}</b> để cấp phát — cần đủ{" "}
                <b className="text-blue-700">{requestInfo?.quantity ?? 0}</b> đơn vị
              </p>
            </div>
            {requestInfo?.asset_code ? (
              <AssetBatchesTable
                assetCode={requestInfo.asset_code}
                assetName={requestInfo.asset_name}
              />
            ) : (
              <p className="text-sm text-red-500 p-2">
                Thiếu thông tin tài sản của yêu cầu
              </p>
            )}
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
    return (
      <div className="mt-4">
        <h4 className="font-semibold text-sm mb-2 text-blue-700">Tiến hành thu hồi tài sản về kho</h4>
        <div className="h-[500px]">
          <ImportAssetsView onClose={resetAndClose} requestId={requestId} />
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
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Thông tin yêu cầu</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">Tài sản:</p>
              <p className="font-medium">{requestInfo?.asset_name || "---"}</p>
              <p className="text-gray-500">Mã TS:</p>
              <p className="font-medium">{requestInfo?.asset_code || "---"}</p>
              <p className="text-gray-500">Loại:</p>
              <p className="font-medium">
                {requestInfo?.type === 1 ? "Cấp phát" : requestInfo?.type === 2 ? "Thu hồi" : requestInfo?.type === 3 ? "Báo lỗi" : "Khác"}
              </p>
              <p className="text-gray-500">Số lượng:</p>
              <p className="font-medium">{requestInfo?.quantity || 0}</p>
              {requestInfo?.note && (
                <>
                  <p className="text-gray-500">Ghi chú từ Chỉ huy:</p>
                  <p className="font-medium italic">{requestInfo.note}</p>
                </>
              )}
            </div>
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
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-end gap-2">
        {mode === "view" ? (
          <>
            <CustomButton type="button" label="Từ chối yêu cầu" variant="danger" size="sm" onClick={() => setMode("reject")} />
            <CustomButton type="button" label="Tiến hành xử lý" variant="info" size="sm" onClick={startProcess} />
          </>
        ) : (
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
