import CustomDrawer from "../../components/common/custom-drawer";
import CustomWrapperPermissions from "../../components/common/custom-wrapper-permissions";
import { SIDEBAR_ITEMS } from "../../constants/sidebar-items.constant";
import { useAppStore } from "../../stores/app-store";
import SidebarItemExpanded from "../sidebar-item-expanded";
import { useMe } from "../../queries/auth.query";
import { RolesEnum } from "../../common/enums/roles.enum";

export default function NavbarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {setOpenDrawer } = useAppStore();
  const { user } = useMe();

  const handleNavigate = () => {
    setOpenDrawer(false);
  };

  const visibleSidebarItems = SIDEBAR_ITEMS.filter((item) => {
    if (user?.role === RolesEnum.COMMANDER && item.path === "/") {
      return false;
    }
    return true;
  });

  return (
    <CustomDrawer
      background="bg-black"
      width="auto"
      position="left"
      onClose={onClose}
      open={open}
    >
      <div>
        {visibleSidebarItems.map((item, index) => {
          return (
            <CustomWrapperPermissions
              permissionsRequired={item?.permissions || []}
              key={index}
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
