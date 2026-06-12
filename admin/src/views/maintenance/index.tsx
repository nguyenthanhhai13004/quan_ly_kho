import { BiCalendar } from "react-icons/bi";
import CustomButton from "../../components/common/custom-button";
import ViewHeader from "../view-header";
import CreateMaintenanceModal from "./modals/create-maintenance-modal";
import { useEffect, useRef, useState } from "react";
import { useModalProvider } from "../../providers/modal-provider";
import MaintenanceTable from "./tables/maintenance-table";
import { useTransactionStore } from "../../stores/transactions-store";

export default function MaintenanceView() {
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
        title="Quản lý bảo trì"
        actions={[
          <CustomButton
            onClick={() => openModal(CreateMaintenanceModal)}
            label="Lên lịch bảo trì"
            icon={<BiCalendar size={20} />}
          />,
        ]}
      />
      <MaintenanceTable />

    </>
  );
}
