import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import ImportExcelView from "../../import-excel";

export default function ImportExcelModal({ onClose, open }: CustomModalProps) {
  return (
    <CustomModal
      title="Nhập tài sản từ file excel"
      width="max-w-7xl"
      height="h-[500px]"
      onClose={onClose}
      open={open}
    >
      <ImportExcelView />
    </CustomModal>
  );
}
