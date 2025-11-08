import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import WelcomeCard from "./welcome-card";
import StatsCard from "./stats-card";

export default function DashboardView() {
  const dataCategory = [
    { id: "Quân trang", label: "Quân trang", value: 120 },
    { id: "Thực phẩm", label: "Thực phẩm", value: 80 },
    { id: "Vũ khí nhẹ", label: "Vũ khí nhẹ", value: 45 },
    { id: "Phương tiện", label: "Phương tiện", value: 25 },
    { id: "Thiết bị điện tử", label: "Thiết bị điện tử", value: 30 },
  ];

  const dataStatus = [
    { status: "Tốt", count: 60 },
    { status: "Bảo trì", count: 15 },
    { status: "Lỗi", count: 10 },
    { status: "Thanh lý", count: 5 },
  ];

  const dataTrend = [
    {
      id: "Nhập",
      data: [
        { x: "01/2025", y: 12 },
        { x: "02/2025", y: 20 },
        { x: "03/2025", y: 18 },
        { x: "04/2025", y: 25 },
        { x: "05/2025", y: 22 },
      ],
    },
    {
      id: "Xuất",
      data: [
        { x: "01/2025", y: 5 },
        { x: "02/2025", y: 10 },
        { x: "03/2025", y: 9 },
        { x: "04/2025", y: 14 },
        { x: "05/2025", y: 12 },
      ],
    },
  ];

  const stats = [
    { label: "Tổng tài sản", value: 100 },
    { label: "Đang cấp phát", value: 72 },
    { label: "Cần bảo trì", value: 8 },
  ];

  return (
    <div className="p-6 grid gap-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
           <WelcomeCard />
        </div>
        <div className="gap-4 grid-cols-2 grid">
          {stats.map((s, index) => (
            <StatsCard label={s.label} value={s.value} key={index} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tròn */}
        <div className="bg-white rounded-2xl shadow p-4 h-[350px]">
          <h3 className="font-semibold mb-3">Phân bố tài sản theo danh mục</h3>
          <ResponsivePie
            data={dataCategory}
            margin={{ top: 20, right: 80, bottom: 40, left: 80 }}
            innerRadius={0.6}
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "category10" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          />
        </div>

        {/* Biểu đồ cột */}
        <div className="bg-white rounded-2xl shadow p-4 h-[350px]">
          <h3 className="font-semibold mb-3">Tài sản theo tình trạng</h3>
          <ResponsiveBar
            data={dataStatus}
            keys={["count"]}
            indexBy="status"
            margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: "paired" }}
            axisBottom={{
              tickRotation: -20,
            }}
            axisLeft={{
              legend: "Số lượng",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
          />
        </div>
      </div>

      {/* Biểu đồ đường */}
      <div className="bg-white rounded-2xl shadow p-4 h-[400px]">
        <h3 className="font-semibold mb-3">Xu hướng nhập/xuất theo tháng</h3>
        <ResponsiveLine
          data={dataTrend}
          margin={{ top: 40, right: 40, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: false }}
          colors={{ scheme: "set2" }}
          axisBottom={{
            legend: "Tháng",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            legend: "Số lượng",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={8}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          useMesh={true}
        />
      </div>
    </div>
  );
}
