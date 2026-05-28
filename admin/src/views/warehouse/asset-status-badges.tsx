import type { AssetStatusSummary } from "../../api/warehouse-api";
import CustomBadge from "../../components/common/custom-badge";



interface Props {
  statuses: AssetStatusSummary[];
}

// eslint-disable-next-line react-refresh/only-export-components
export const statusMap: Record<
    string,
    {
      label: string;
      color: "success" | "warning" | "error" | "default";
    }
  > = {
    1: { label: "Tốt", color: "success" },
    3: { label: "Cần bảo trì", color: "warning" },
    4: { label: "Hết hạn", color: "default" },
    2: { label: "Lỗi", color: "error" },
  };

const AssetStatusBadges: React.FC<Props> = ({ statuses }) => {

  return (
    <div className="flex flex-wrap gap-2 w-[220px]">
      {statuses
        .filter((item) => item.quantity > 0)
        .map((item) => {
          const mapItem = statusMap[item.status];

          if (!mapItem) return null;

          return (
            <CustomBadge
              key={item.status}
              label={`${mapItem.label} ${item.quantity}`}
              status={mapItem.color}
            />
          );
        })}
    </div>
  );
};

export default AssetStatusBadges;
