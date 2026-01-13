import CustomDrawer from "../../components/common/custom-drawer";
import CustomWrapperPermissions from "../../components/common/custom-wrapper-permissions";
import { SIDEBAR_ITEMS } from "../../constants/sidebar-items.constant";
import { useAppStore } from "../../stores/app-store";
import SidebarItemExpanded from "../sidebar-item-expanded";

export default function NavbarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {setOpenDrawer } = useAppStore();
   const handleNavigate = () => {
    setOpenDrawer(false);
  };
  return (
    <CustomDrawer
      background="bg-black"
      width="auto"
      position="left"
      onClose={onClose}
      open={open}
    >
      <div>
        {SIDEBAR_ITEMS.map((item, index) => {
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
                onNavigate={handleNavigate}
              />
            </CustomWrapperPermissions>
          );
        })}
      </div>
    </CustomDrawer>
  );
}
