import SelectWarehouseModal from "../../views/modals/select-warehouse-modal";
import Sidebar from "../../views/sidebar";
import CustomHeader from "../common/custom-header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-[#F5F4F9]">
      <div className="flex flex-1">
        <Sidebar />
        <div className="w-full p-2 overflow-hidden">
          <CustomHeader />
          <div className="lg:px-5 lg:pb-5">
          {children}
          </div>
        </div>
      </div>
      <SelectWarehouseModal/>
    </div>
  );
}
