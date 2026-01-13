import CustomButton from "../../components/common/custom-button";
import { ModalEnum } from "../../constants/modals.constant";
import { useModalProvider } from "../../providers/modal-provider";
import ViewHeader from "../view-header";
import ExportHistoryModal from "./export-history-modal";
import ImportExportTransactionsTable from "./import-export-transactions-table";

export default function ImportExportTransactionsView() {
  const {currentModal,setCurrentModal} = useModalProvider();
  return (
    <>
      <ViewHeader
        title="Lịch sử xuất nhập"
        actions={[<CustomButton variant="success" onClick={()=>setCurrentModal(ModalEnum.EXPORT_HISTORY_MODAL)} label="Xuất DS Lịch sử" />]}
      />
      <ImportExportTransactionsTable />
      <ExportHistoryModal open={currentModal === ModalEnum.EXPORT_HISTORY_MODAL} onClose={()=>setCurrentModal(ModalEnum.CLOSE_MODAL)}/>
    </>
  );
}
