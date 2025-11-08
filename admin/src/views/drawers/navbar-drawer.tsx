import CustomDrawer from "../../components/common/custom-drawer";
import { SIDEBAR_ITEMS } from "../../constants/sidebar-items.constant";
import SidebarItemExpanded from "../sidebar-item-expanded";

export default function NavbarDrawer({open,onClose}:{open:boolean,onClose:()=>void}) {
  return (
    <CustomDrawer background="bg-black" width="auto" position="left" onClose={onClose} open={open}>
      <div>
        {SIDEBAR_ITEMS.map((item, index) => {
          return (
            <SidebarItemExpanded
              label={item.label}
              path={item.path}
              icon={item.icon}
              key={index}
            />
          );
        })}
      </div>
    </CustomDrawer>
  );
}
