import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import ImportAssetsView from "../../import-assets";

export default function ImportManualModal({ onClose, open }: CustomModalProps) {
  return (
    <CustomModal
      title="Nhập kho thủ công"
      onClose={onClose}
      open={open}
      width="w-7xl"
      height="h-[500px]"
    >
      <ImportAssetsView/>
    </CustomModal>
  );
}
