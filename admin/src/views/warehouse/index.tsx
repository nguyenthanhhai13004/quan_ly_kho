import { BiExport, BiImport } from "react-icons/bi";
import CustomButton from "../../components/common/custom-button";
import ViewHeader from "../view-header";
import AssetInWarehouseTable from "./asset-in-warehouse-table";
import { FaFileExcel } from "react-icons/fa";
import ExportExcelModal from "./modals/export-excel-modal";
import ExportManualModal from "./modals/export-manual-modal";
import ImportExcelModal from "./modals/import-excel-modal";
import ImportManualModal from "./modals/import-manual-modal";
import { useModalProvider } from "../../providers/modal-provider";
import { useEffect, useRef, useState } from "react";
import { useTransactionStore } from "../../stores/transactions-store";
import AssetInWHDetailModal from "./modals/asset-in-wh-detail-modal";

export default function AssetInWarehouseView() {
  const { openModal } = useModalProvider();
  const { resetBatchState,resetImportManualState } = useTransactionStore();
  const hasResetRef = useRef(false);
  useEffect(() => {
    if (!hasResetRef.current) {
      resetBatchState();
      resetImportManualState();
      hasResetRef.current = true;
    }
  }, []);
  return (
    <>
      <ViewHeader
        title="Quản lý tài sản trong kho"
        actions={[
          <CustomButton
            onClick={() => openModal(ImportManualModal)}
            label="Nhập kho"
            icon={<BiImport size={20} />}
          />,
          <CustomButton
            variant="success"
            label="Nhập kho từ Excel"
            onClick={() => openModal(ImportExcelModal)}
            icon={<FaFileExcel size={16} />}
          />,
          <CustomButton
            onClick={() => openModal(ExportManualModal)}
            label="Xuất kho"
            icon={<BiExport size={16} />}
          />,
          <CustomButton
            variant="success"
            label="Xuất kho từ Excel"
            onClick={() => openModal(ExportExcelModal)}
            icon={<FaFileExcel size={16} />}
          />,
        ]}
      />
      <AssetInWarehouseTable />

      {/* <AssetInWHDetailModal/> */}
    </>
  );
}
