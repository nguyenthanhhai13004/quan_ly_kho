import CustomModal, { type CustomModalProps } from "../../../components/common/custom-modal";
import ExportAssetsView from "../../export-manual";


export default function ExportManualModal({ onClose, open }: CustomModalProps) {
  
  return (
    <CustomModal
      title="Xuất kho thủ công"
      onClose={onClose}
      open={open}
      width="w-7xl"
      height="h-[500px]"
    >
      <ExportAssetsView/>
    </CustomModal>
  );
}
