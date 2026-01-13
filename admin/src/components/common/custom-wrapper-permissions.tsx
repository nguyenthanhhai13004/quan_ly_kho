import { PermissionsEnum } from "../../common/enums/permissons.enum";
import { useMe } from "../../queries/auth.query";

type CustomWrapperPermissionsProps = {
  permissionsRequired: PermissionsEnum[];
  children: React.ReactNode;
  uiDeny?:React.ReactNode
};

export default function CustomWrapperPermissions({
  children,
  permissionsRequired,
  uiDeny
}: CustomWrapperPermissionsProps) {
  const { user } = useMe();
  const userPermissions: PermissionsEnum[] =
    user?.permissions
      ?.map((p) => p as PermissionsEnum)
      .filter((p): p is PermissionsEnum =>
        Object.values(PermissionsEnum).includes(p),
      ) || [];
  const hasPermission =
    permissionsRequired.length === 0 ||
    permissionsRequired.some((p) => userPermissions.includes(p));
  if (!hasPermission){
    if (uiDeny) return uiDeny;
    return;
  }

  return children;
}
