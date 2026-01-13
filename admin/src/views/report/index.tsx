import ViewHeader from "../view-header";
import ReportsTable from "./reports-table";
export default function ReportListView() {
  return (
    <>
      <ViewHeader
        title="Quản lý báo cáo và thống kê"
        actions={[]}
      />
      <ReportsTable/>
    </>
  );
}
