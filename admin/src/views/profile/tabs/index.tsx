import type { ICustomTab } from "../../../components/common/custom-tabs";
import CustomTabs from "../../../components/common/custom-tabs";
import ChangePasswordContent from "./change-password-content";
import ProfileInfoContent from "./profile-info-content";

export default function ProfileTabs() {
  const tabs: ICustomTab[] = [
    {
      key: "info",
      label: "Thông tin cá nhân",
      content: <ProfileInfoContent />,
    },
    {
      key: "change-password",
      label: "Thay đổi mật khẩu",
      content: <ChangePasswordContent />,
    },
  ];

  return <CustomTabs tabs={tabs} defaultActive="info" />;
}