import SidebarItemExpanded from "./sidebar-item-expanded";
import { AiOutlineAppstore } from "react-icons/ai";
import { useAppProvider } from "../providers/app-providers";
import SidebarItemCollapsed from "./sidebar-item-collapsed";
import { FiSidebar } from "react-icons/fi";
import { SIDEBAR_ITEMS } from "../constants/sidebar-items.constant";
import CustomWrapperPermissions from "../components/common/custom-wrapper-permissions";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useAppStore } from "../stores/app-store";

export default function Sidebar() {
  const { setToggle, toggle} = useAppProvider();
  const {warehouseSelectedName,setWarehouseSelectedName} = useAppStore();
  useEffect(()=>{
    setWarehouseSelectedName(Cookies.get("wh-selected-name")||"")
  },[])
  return (
    <div
      className={`${
        !toggle ? "lg:w-[250px]" : "lg:w-[60px]"
      } hidden bg-black lg:flex flex-col shrink-0  px-2 py-3 text-white border-r border-gray-300 transition-[width] duration-300 ease-in-out`}
    >
      <div className="flex gap-3 items-center justify-between mb-5">
        {!toggle && (
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black">
              <AiOutlineAppstore size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">ASoftware</h4>
              {
                warehouseSelectedName && <span className="inline-block text-xs">
                {warehouseSelectedName}
              </span>
              }
            </div>
          </div>
        )}
        <div
          onClick={() => setToggle(!toggle)}
          className="flex items-center justify-center w-10 h-10 cursor-col-resize"
        >
          <FiSidebar size={20} />
        </div>
      </div>
      {SIDEBAR_ITEMS.map((item, index) => {
        if (toggle) {
          return (
            <CustomWrapperPermissions
              permissionsRequired={item?.permissions || []}
            >
              <SidebarItemCollapsed
                label={item.label}
                path={item.path}
                icon={item.icon}
                key={index}
                children={item.children}
              />
            </CustomWrapperPermissions>
          );
        }
        return (
          <CustomWrapperPermissions
            permissionsRequired={item?.permissions || []}
          >
            <SidebarItemExpanded
              label={item.label}
              path={item.path}
              icon={item.icon}
              key={index}
              children={item.children}
            />
          </CustomWrapperPermissions>
        );
      })}
    </div>
  );
}
