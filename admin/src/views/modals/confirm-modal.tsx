import { CgClose } from "react-icons/cg";
import CustomModal from "../../components/common/custom-modal";
import CustomButton from "../../components/common/custom-button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  onClose,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <CustomModal open={open} onClose={onClose} width="max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <CgClose
          onClick={onClose}
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          size={20}
        />
      </div>

      <p className="text-gray-700 mb-6 text-sm">{message}</p>

      <div className="flex justify-end gap-3">
        <CustomButton
          variant="danger"
          onClick={handleCancel}
          className="rounded-xl border-gray-300"
        >
          {cancelText}
        </CustomButton>
        <CustomButton
          onClick={handleConfirm}
          variant="info"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : confirmText}
        </CustomButton>
      </div>
    </CustomModal>
  );
}
