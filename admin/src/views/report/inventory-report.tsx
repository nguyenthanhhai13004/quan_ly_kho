import { useDownloadInventoryReport, useReportInventory } from "../../queries/report.query";
import ReportBase from "./report-base";

const ReportDetailView = () => {
  const { mutate: downloadExcel } = useDownloadInventoryReport();
  const { data } = useReportInventory();

  return (
    <ReportBase
      data={data}
      exportExcel={downloadExcel}
      reportFileName="bao_cao_ton_kho"
      reportTitle="Báo cáo tồn kho"
    />
  );
};

export default ReportDetailView;
