import CustomButton from "../../components/common/custom-button";

import { useModalProvider } from "../../providers/modal-provider";
import ViewHeader from "../view-header";
import CreateWarehouseModal from "./modals/create-warehouse-modal";
import WarehousesTable from "./warehouse-tables";

export default function WarehouseListView() {
  const { openModal } = useModalProvider();
  return (
    <>
      <ViewHeader title="Danh sách kho" actions={[
        <CustomButton key="create-warehouse" label="Tạo kho"  onClick={()=>openModal(CreateWarehouseModal)}/>
      ]}/>
      <WarehousesTable/>
    </>
  );
}
