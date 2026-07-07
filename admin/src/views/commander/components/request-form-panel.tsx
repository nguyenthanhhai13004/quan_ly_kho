import { useAdvisorRequestStore } from "../../../stores/advisor-request-store";
import CustomTable from "../../../components/common/custom-table";
import CustomIcon from "../../../components/common/custom-icon";
import { BiTrash } from "react-icons/bi";
import CustomInput from "../../../components/common/custom-input";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { useCreateAdvisorRequest } from "../../../queries/advisor-request.query";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAllClasses } from "../../../queries/class.query";

const REQUEST_TYPE_OPTIONS = [
  { label: "Cấp phát tài sản", value: "1" },
  { label: "Thu hồi tài sản", value: "2" },
  // { label: "Khác", value: "4" },
];

export default function RequestFormPanel({ onClose }: { onClose: () => void }) {
  const {
    selectedAssets,
    type,
    note,
    classId: selectedClassId,
    setType,
    setNote,
    setClassId: setSelectedClassId,
    removeSelectedAsset,
    updateAssetQuantity,
    resetState,
  } = useAdvisorRequestStore();

  const { mutate, isPending } = useCreateAdvisorRequest();
  const queryClient = useQueryClient();
  const { classes } = useAllClasses();
  const availableClasses = classes || [];

  useEffect(() => {
    if (classes?.length && !selectedClassId) {
      setSelectedClassId(String(classes[0].id));
    }
  }, [classes, selectedClassId]);

  const columns = ["Hành động", "Mã", "Tên", "Số lượng"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type !== "4") {
      if (selectedAssets.length === 0) {
        toast.error("Vui lòng chọn ít nhất một tài sản");
        return;
      }

      const hasInvalidQuantity = selectedAssets.some((a) => !a.quantity || a.quantity < 1);
      if (hasInvalidQuantity) {
        toast.error("Số lượng tài sản không hợp lệ");
        return;
      }

      if (type === "2") {
        const hasMissingCode = selectedAssets.some((a) => !a.allocation_transaction_code);
        if (hasMissingCode) {
          toast.error("Tài sản thu hồi không hợp lệ (thiếu mã đơn cấp phát)");
          return;
        }
      }
    } else {
      if (!note?.trim()) {
        toast.error("Vui lòng nhập nội dung ghi chú lý do / ý kiến");
        return;
      }
    }

    const items = type === "4" ? undefined : selectedAssets.map((a) => ({
      asset_id: a.id,
      quantity: a.quantity,
      allocation_transaction_code: a.allocation_transaction_code || undefined,
    }));

    if (!selectedClassId) {
      toast.error("Vui lòng chọn lớp học yêu cầu");
      return;
    }

    mutate(
      {
        type: Number(type),
        class_id: Number(selectedClassId),
        note,
        items,
      },
      {
        onSuccess: () => {
          toast.success("Gửi yêu cầu thành công");
          resetState();
          queryClient.invalidateQueries({ queryKey: ["my-advisor-requests"] });
          onClose();
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-lg shadow">
      <div className="flex-1 overflow-auto">
        {type === "4" ? (
          <div className="p-6 text-center text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-2xl m-4">
            <p className="font-semibold text-blue-600 mb-1">Yêu cầu khác / Trao đổi thông tin</p>
            <p>Gửi yêu cầu trao đổi hoặc phản hồi thông tin với quản lý kho. Không cần chọn tài sản hay đơn hàng.</p>
          </div>
        ) : (
          <CustomTable
            columns={columns}
            size="small"
            data={selectedAssets.map((item, index) => [
              <CustomIcon
                key={`trash-${index}`}
                icon={<BiTrash size={16} />}
                label="Xóa"
                onClick={() => removeSelectedAsset(index)}
                variant="danger"
              />,
              <div key={`code-container-${index}`}>
                <span className="text-xs font-semibold block">{item.code}</span>
                {item.allocation_transaction_code && (
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1 py-0.2 rounded font-mono">
                    {item.allocation_transaction_code}
                  </span>
                )}
              </div>,
              <span className="text-xs truncate max-w-[120px]" title={item.name} key={`name-${index}`}>
                {item.name}
              </span>,
              type === "2" ? (
                <span className="text-xs font-semibold px-2 py-1 bg-gray-50 border border-gray-200 rounded block w-[80px] text-center" key={`quantity-${index}`}>
                  {item.quantity}
                </span>
              ) : (
                <CustomInput
                  key={`quantity-${index}`}
                  name={`items.${index}.quantity`}
                  value={item.quantity}
                  onChange={(e) => updateAssetQuantity(index, Number(e.target.value))}
                  type="number"
                  className="text-xs"
                  width="80px"
                  min={0}
                />
              ),
            ])}
          />
        )}

        <div className="flex flex-col gap-4 p-4 mt-2">
          <CustomSelect
            label="Lớp học yêu cầu"
            name="class_id"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
            labelType="top"
            options={availableClasses.map((c) => ({ label: c.name, value: String(c.id) }))}
          />

          <CustomSelect
            label="Loại yêu cầu"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            labelType="top"
            options={REQUEST_TYPE_OPTIONS}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#344054]">
              Ghi chú chỉ huy
            </label>
            <textarea
              name="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Nhập ghi chú..."
              className="border border-[#D0D5DD] rounded-lg p-3 text-sm focus:outline-none focus:border-[#4B5563] resize-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4 border-t">
        <CustomButton
          className="w-full"
          variant="default"
          label="Hủy"
          size="md"
          type="button"
          onClick={() => {
            resetState();
            onClose();
          }}
        />
        <CustomButton
          className="w-full"
          label="Gửi yêu cầu"
          size="md"
          type="submit"
          isLoading={isPending}
        />
      </div>
    </form>
  );
}
