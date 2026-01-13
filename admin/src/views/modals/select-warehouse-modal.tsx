import { useState } from "react";
import CustomModal from "../../components/common/custom-modal";
import Cookies from "js-cookie";
import { WAREHOUSE_CURRENT_COOKIE } from "../../constants/cookies.constant";
import { setWarehouseId } from "../../utils/storage";
import { useWarehouseOwn } from "../../queries/warehouse.query";
import {
  useStatsAssetByStatus,
  useStatsAssets,
  useStatsAssetsByCategory,
  useStatsImportExportWHOwn,
} from "../../queries/stats.query";
import { useMe } from "../../queries/auth.query";
import { RolesEnum } from "../../common/enums/roles.enum";
import { useAppStore } from "../../stores/app-store";

export default function SelectWarehouseModal() {
  const { warehouses } = useWarehouseOwn();
  const warehouseSeleted = Cookies.get(WAREHOUSE_CURRENT_COOKIE);
  const{user} = useMe();
  const [isOpen, setIsOpen] = useState(!warehouseSeleted);
  const { refetch: refetchCategory } = useStatsAssetsByCategory();
  const { refetch: refetchTrend } = useStatsImportExportWHOwn();
  const { refetch: refetchStatus } = useStatsAssetByStatus();
  const { refetch: refetchAssetsTotal } = useStatsAssets();
  const {setWarehouseSelectedName} = useAppStore();
  const handleSelectedWarehouse = (warehouse: { id: number; name: string }) => {
    setWarehouseId(warehouse.id);
    Cookies.set("wh-selected-name",warehouse.name);
    setWarehouseSelectedName(warehouse.name);
    setIsOpen(false);
    refetchCategory();
    refetchTrend();
    refetchStatus();
    refetchAssetsTotal();
  };
  return (
    <CustomModal
      open={isOpen && (user != null && user.role === RolesEnum.WAREHOUSE_OFFICER)}
      onClose={() => {}}
      title="Vui lòng chọn kho quản lý"
      width="max-w-lg"
    >
      <div className="grid grid-cols-3 gap-3">
        {warehouses?.items.map((w, index) => (
          <div
            onClick={() => handleSelectedWarehouse(w)}
            key={index}
            className="bg-red-400 border-b-3 border-r-3 text-sm border-gray-500 text-center rounded-2xl py-3 px-2 cursor-pointer hover:translate-y-0.5 transition-all duration-300 ease-in-out"
          >
            {w.name}
          </div>
        ))}
      </div>
    </CustomModal>
  );
}
