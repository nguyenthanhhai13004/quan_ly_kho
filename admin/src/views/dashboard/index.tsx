import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import StatsCard from "./stats-card";
import {
  useStatsAssetByStatus,
  useStatsAssets,
  useStatsAssetsByCategory,
  useStatsImportExportWHOwn,
} from "../../queries/stats.query";

export default function DashboardView() {
  const { dataCategory } = useStatsAssetsByCategory();
  const { dataTrend } = useStatsImportExportWHOwn();
  const {dataStatus} = useStatsAssetByStatus();
  const {assetsTotal} = useStatsAssets();
  return (
    <div className="p-6 grid gap-6">
      <div className="gap-4 grid-cols-3 grid">
          <StatsCard label={"Tổng tài sản"} value={assetsTotal?.total_assets_in_warehouse || 0}/>
          <StatsCard label={"Đang cấp phát"} value={assetsTotal?.total_allocated || 0}/>
          <StatsCard label={"Cần bảo trì"} value={assetsTotal?.total_need_maintenance || 0}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 h-[350px]">
          <h3 className="font-semibold mb-3">Phân bố tài sản theo danh mục</h3>
          <ResponsivePie
            data={dataCategory || []}
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
            data={dataStatus || []}
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

      <div className="bg-white rounded-2xl shadow p-4 h-[400px]">
        <h3 className="font-semibold mb-3">Xu hướng nhập/xuất trong 12 tháng gần nhất</h3>
        <ResponsiveLine
          data={dataTrend || []}
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
