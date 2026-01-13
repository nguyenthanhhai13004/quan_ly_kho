import { BiCalendar } from "react-icons/bi";
import CustomButton from "../../components/common/custom-button";
import ViewHeader from "../view-header";
import CreateMaintenanceModal from "./modals/create-maintenance-modal";
import { useEffect, useRef, useState } from "react";
import { ModalEnum, type ModalEnumType } from "../../constants/modals.constant";
import MaintenanceTable from "./tables/maintenance-table";
import { useTransactionStore } from "../../stores/transactions-store";

export default function MaintenanceView() {
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
        title="Quản lý bảo trì"
        actions={[
          <CustomButton
            onClick={() => setModal(ModalEnum.CREATE_MAINTENANCE_MODAL)}
            label="Lên lịch bảo trì"
            icon={<BiCalendar size={20} />}
          />,
        ]}
      />
      <MaintenanceTable />
      <CreateMaintenanceModal
        onClose={() => setModal(ModalEnum.CLOSE_MODAL)}
        open={modal === ModalEnum.CREATE_MAINTENANCE_MODAL}
      />
    </>
  );
}
