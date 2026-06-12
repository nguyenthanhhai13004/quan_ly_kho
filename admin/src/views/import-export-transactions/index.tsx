import CustomButton from "../../components/common/custom-button";

import { useModalProvider } from "../../providers/modal-provider";
import ViewHeader from "../view-header";
import ExportHistoryModal from "./export-history-modal";
import ImportExportTransactionsTable from "./import-export-transactions-table";

export default function ImportExportTransactionsView() {
  const { openModal } = useModalProvider();
  return (
    <>
      <ViewHeader
        title="Lịch sử xuất nhập"
        actions={[<CustomButton variant="success" onClick={()=>openModal(ExportHistoryModal)} label="Xuất DS Lịch sử" />]}
      />
      <ImportExportTransactionsTable />
    </>
  );
}
