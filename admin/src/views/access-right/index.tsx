import CustomBreadcrumbs from "../../components/common/custom-breadcrumbs";
import { breadcrumbs } from "../../constants/breadcrumbs";
import AccessRightTable from "./access-right-table";

export default function AccessRightView() {
  return (
    <>
      <CustomBreadcrumbs breadcrumbs={[breadcrumbs.home, breadcrumbs.system]} />
      <div className="px-5 pb-5">
        <h2 className="text-xl text-[#2b7dbc] py-4 border-b border-gray-300 mb-3">
          Phân quyền cho role
        </h2>
        <AccessRightTable/>
      </div>
    </>
  );
}
