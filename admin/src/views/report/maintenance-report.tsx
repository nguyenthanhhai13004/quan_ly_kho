import { useDownloadMaintenanceReport, useReportMaintenance } from "../../queries/report.query";
import ReportBase from "./report-base";

const MaintenanceReportView = () => {
  const { mutate: downloadExcel } = useDownloadMaintenanceReport();
  const { data } = useReportMaintenance()

  return (
    <ReportBase
      data={data}
      exportExcel={downloadExcel}
      reportFileName="bao_cao_bao_tri"
      reportTitle="Báo cáo bảo trì"
    />
  );
};

export default MaintenanceReportView;
