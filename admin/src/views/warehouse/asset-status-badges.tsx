import type { AssetStatusSummary } from "../../api/warehouse-api";
import CustomBadge from "../../components/common/custom-badge";
import { statusMap } from "../../constants/asset-status-map.constant";



interface Props {
  statuses: AssetStatusSummary[];
}

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
