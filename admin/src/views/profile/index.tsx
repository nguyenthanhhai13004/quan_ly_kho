import CustomBreadcrumbs from "../../components/common/custom-breadcrumbs";
import { breadcrumbs } from "../../constants/breadcrumbs";
import ProfileTabs from "./tabs";

export default function ProfileView() {
  return (
    <>
      <CustomBreadcrumbs breadcrumbs={[breadcrumbs.home,breadcrumbs.profile]} />
      <div className="px-5 pb-5">
        <ProfileTabs/>
      </div>
    </>
  );
}
