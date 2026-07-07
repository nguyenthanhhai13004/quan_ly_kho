import type { AssetStatusSummary } from "../../api/warehouse-api";
import CustomBadge from "../../components/common/custom-badge";
import { statusMap } from "../../constants/asset-status-map.constant";

interface Props {
  statuses: AssetStatusSummary[];
}

const STATUS_DISPLAY_ORDER = [1, 3, 4, 2];

const AssetStatusBadges: React.FC<Props> = ({ statuses }) => {
  const statusByCode = new Map(
    statuses
      .filter((item) => item.quantity > 0)
      .map((item) => [Number(item.status), item]),
  );

  return (
    <div className="grid w-[250px] grid-cols-2 gap-2">
      {STATUS_DISPLAY_ORDER.map((status) => {
        const item = statusByCode.get(status);
        if (!item) return null;

        const mapItem = statusMap[item.status];

        if (!mapItem) return null;

        return (
          <CustomBadge
            key={item.status}
            label={`${mapItem.label} ${item.quantity}`}
            status={mapItem.color}
            className="whitespace-nowrap"
          />
        );
      })}
    </div>
  );
};

export default AssetStatusBadges;
