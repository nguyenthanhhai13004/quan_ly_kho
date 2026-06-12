import { TbCubeSend } from "react-icons/tb";
import CustomButton from "../../components/common/custom-button";
import ViewHeader from "../view-header";
import { useEffect, useRef, useState } from "react";
import { useModalProvider } from "../../providers/modal-provider";
import DisposalAssetTable from "./tables/disposal-assets-table";
import DisposalAssetsModal from "./modals/disposal-assets-modal";
import { useTransactionStore } from "../../stores/transactions-store";

export default function DisposalAssetView() {
  const { openModal } = useModalProvider();
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
            onClick={() => openModal(DisposalAssetsModal)}
            label="Tạo đơn mới"
            icon={<TbCubeSend size={20} />}
          />,
        ]}
      />
      <DisposalAssetTable />

    </>
  );
}
