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

const REQUEST_TYPE_OPTIONS = [
  { label: "Cấp phát tài sản", value: "1" },
  { label: "Thu hồi tài sản", value: "2" },
  { label: "Báo lỗi tài sản", value: "3" },
  { label: "Khác", value: "4" },
];

export default function RequestFormPanel({ onClose }: { onClose: () => void }) {
  const {
    selectedAssets,
    type,
    note,
    setType,
    setNote,
    removeSelectedAsset,
    updateAssetQuantity,
    resetState,
  } = useAdvisorRequestStore();

  const { mutate, isPending } = useCreateAdvisorRequest();
  const queryClient = useQueryClient();

  const columns = ["Hành động", "Mã", "Tên", "Số lượng"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedAssets.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tài sản");
      return;
    }

    const hasInvalidQuantity = selectedAssets.some((a) => !a.quantity || a.quantity < 1);
    if (hasInvalidQuantity) {
      toast.error("Số lượng tài sản không hợp lệ");
      return;
    }

    const items = selectedAssets.map((a) => ({
      asset_id: a.id,
      quantity: a.quantity,
    }));

    mutate(
      {
        type: Number(type),
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
            <span className="text-xs font-semibold">{item.code}</span>,
            <span className="text-xs truncate max-w-[120px]" title={item.name}>
              {item.name}
            </span>,
            <CustomInput
              key={`quantity-${index}`}
              name={`items.${index}.quantity`}
              value={item.quantity}
              onChange={(e) => updateAssetQuantity(index, Number(e.target.value))}
              type="number"
              className="text-xs"
              width="80px"
              min={1}
            />,
          ])}
        />

        <div className="flex flex-col gap-4 p-4 mt-2">
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
              Ghi chú lý do / ý kiến chỉ huy
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
