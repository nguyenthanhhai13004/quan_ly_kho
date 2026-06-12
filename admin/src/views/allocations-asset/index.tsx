import { BiCalendar } from "react-icons/bi";
import CustomButton from "../../components/common/custom-button";
import ViewHeader from "../view-header";
import { useEffect, useRef, useState } from "react";
import { useModalProvider } from "../../providers/modal-provider";
import AllocationsAssetModal from "./modals/allocations-assets-modal";
import AllocationsAssetTable from "./tables/allocations-assets-table";
import { useTransactionStore } from "../../stores/transactions-store";

export default function AllocationsAssetView() {
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
        title="Quản lý cấp phát tài sản"
        actions={[
          <CustomButton
            variant="info"
            onClick={() => openModal(AllocationsAssetModal)}
            label="Cấp phát tài sản"
            icon={<BiCalendar size={20} />}
          />,
        ]}
      />
      <AllocationsAssetTable />

    </>
  );
}
