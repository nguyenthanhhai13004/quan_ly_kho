import { FaFileExcel } from "react-icons/fa";
import CustomButton from "../../components/common/custom-button";
import CustomInput from "../../components/common/custom-input";
import CustomModal, { type CustomModalProps } from "../../components/common/custom-modal";

export default function ExportHistoryModal({onClose,open}:CustomModalProps) {
  return (
    <CustomModal title="Xuất lịch sử" open={open} onClose={onClose} width="w-2xl">
      <div className="pt-5 flex gap-2">
        <CustomInput label="Từ ngày" type="date" labelType="top" />
        <CustomInput label="Đến ngày" type="date" labelType="top" />
        <CustomButton
          label="Xuất"
          size="sm"
          variant="success"
          icon={<FaFileExcel size={20} />}
        />
      </div>
    </CustomModal>
  );
}
