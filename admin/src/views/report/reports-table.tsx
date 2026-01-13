import { Link } from "react-router-dom";
import CustomTable from "../../components/common/custom-table";

export default function ReportsTable() {
  const reports = [
    {
      path: "/Report/Inventory",
      name: "Báo cáo tồn kho",
    },
    {
      path: "Inventory",
      name: "Báo cáo cấp phát",
    },
    {
      path: "Inventory",
      name: "Báo cáo bảo trì",
    },
    {
      path: "Inventory",
      name: "Báo cáo thanh lý",
    },
  ];
  const columns = ["STT", "Tên báo cáo"];
  return (
    <CustomTable
      columns={columns}
      data={reports.map((r, index) => [
        index + 1,
        <Link to={r.path} className="uppercase hover:underline text-blue-500">
          {r.name}
        </Link>,
      ])}
    />
  );
}
