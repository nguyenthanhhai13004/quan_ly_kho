import { TbCubeSend } from "react-icons/tb";
import CustomButton from "../../components/common/custom-button";
import ViewHeader from "../view-header";
import { useEffect, useRef, useState } from "react";
import { ModalEnum, type ModalEnumType } from "../../constants/modals.constant";
import DisposalAssetTable from "./tables/disposal-assets-table";
import DisposalAssetsModal from "./modals/disposal-assets-modal";
import { useTransactionStore } from "../../stores/transactions-store";

export default function DisposalAssetView() {
  const [modal, setModal] = useState<ModalEnumType>(ModalEnum.CLOSE_MODAL);
  const { resetBatchState } = useTransactionStore();
  const hasResetRef = useRef(false);
  useEffect(() => {
    if (!hasResetRef.current) {
      resetBatchState();
      hasResetRef.current = true;
    }
  }, []);
  return (
    <>
      <ViewHeader
        title="Thanh lý tài sản"
        actions={[
          <CustomButton
            variant="info"
            onClick={() => setModal(ModalEnum.DISPOSAL_ASSETS_MODAL)}
            label="Tạo đơn mới"
            icon={<TbCubeSend size={20} />}
          />,
        ]}
      />
      <DisposalAssetTable />
      <DisposalAssetsModal
        onClose={() => setModal(ModalEnum.CLOSE_MODAL)}
        open={modal == ModalEnum.DISPOSAL_ASSETS_MODAL}
      />
    </>
  );
}
