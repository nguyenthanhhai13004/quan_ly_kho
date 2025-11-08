import SidebarItemExpanded from "./sidebar-item-expanded";
import { AiOutlineAppstore } from "react-icons/ai";
import { useAppProvider } from "../providers/app-providers";
import SidebarItemCollapsed from "./sidebar-item-collapsed";
import { FiSidebar } from "react-icons/fi";
import { SIDEBAR_ITEMS } from "../constants/sidebar-items.constant";
import CustomWrapperPermissions from "../components/common/custom-wrapper-permissions";

export default function Sidebar() {
  const { setToggle, toggle } = useAppProvider();
  return (
    <div
      className={`${
        !toggle ? "lg:w-[250px]" : "lg:w-[60px]"
      } hidden bg-black lg:flex flex-col shrink-0  px-2 py-3 text-white border-r border-gray-300 transition-[width] duration-300 ease-in-out`}
    >
      <div className="flex gap-3 items-center justify-between mb-5">
        {!toggle && (
          <div className="flex gap-2 items-center">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-black">
              <AiOutlineAppstore size={24} />
            </div>
            <h4 className="font-semibold text-sm">ASoftware</h4>
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
            />
          </CustomWrapperPermissions>
        );
      })}
    </div>
  );
}
