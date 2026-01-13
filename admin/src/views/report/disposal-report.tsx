import { useDownloadDisposalReport, useReportDisposal } from "../../queries/report.query";
import ReportBase from "./report-base";

const DisposalReportView = () => {
  const { mutate: downloadExcel } = useDownloadDisposalReport();
  const { data } = useReportDisposal();

  return (
    <ReportBase
      data={data}
      exportExcel={downloadExcel}
      reportFileName="bao_cao_thanh_ly"
      reportTitle="Báo cáo thanh lý"
    />
  );
};

export default DisposalReportView;
