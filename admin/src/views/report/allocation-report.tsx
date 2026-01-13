import { useDownloadAllocationReport, useReportAllocation } from "../../queries/report.query";
import ReportBase from "./report-base";

const AllocationReportView = () => {
  const { mutate: downloadExcel } = useDownloadAllocationReport();
  const { data } = useReportAllocation();

  return (
    <ReportBase
      data={data}
      exportExcel={downloadExcel}
      reportFileName="bao_cao_cap_phat"
      reportTitle="Báo cáo cấp phát"
    />
  );
};

export default AllocationReportView;
