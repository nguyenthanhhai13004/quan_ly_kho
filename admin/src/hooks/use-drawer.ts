import { useSearchParams } from "react-router-dom";
import { DrawerEnum, type DrawerEnumType } from "../constants/drawers.constant";

export function useDrawer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const drawer = searchParams.get("drawer");

  const toggleFilterDrawer = () => {
    const newParams = new URLSearchParams(searchParams);
    if (drawer) {
      newParams.delete("drawer");
    } else {
      newParams.set("drawer", String(DrawerEnum.FILTER_DRAWER));
    }
    setSearchParams(newParams);
  };


  const openDrawer = (drawer:DrawerEnumType) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("drawer", String(drawer));
    setSearchParams(newParams);
  };

  const closeDrawer = () => {
    if (!drawer) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("drawer");
    setSearchParams(newParams);
  };

  return {
    drawer,
    toggleFilterDrawer,
    openDrawer,
    closeDrawer,
  };
}
