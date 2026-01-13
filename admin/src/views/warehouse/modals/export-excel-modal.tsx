import type { CustomModalProps } from "../../../components/common/custom-modal";
import CustomModal from "../../../components/common/custom-modal";
import ExportExcelView from "../../export-excel";

export default function ExportExcelModal({ onClose, open }: CustomModalProps) {
  return (
    <CustomModal title="Xuất tài sản từ file excel" width="w-7xl" height="h-[500px]" onClose={onClose} open={open}>
      <ExportExcelView/>
    </CustomModal>
  );
}
