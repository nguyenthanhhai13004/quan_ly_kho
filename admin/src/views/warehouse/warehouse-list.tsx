import CustomButton from "../../components/common/custom-button";
import { ModalEnum } from "../../constants/modals.constant";
import { useModalProvider } from "../../providers/modal-provider";
import ViewHeader from "../view-header";
import CreateWarehouseModal from "./modals/create-warehouse-modal";
import WarehousesTable from "./warehouse-tables";

export default function WarehouseListView() {
  const {currentModal, setCurrentModal} = useModalProvider();
  return (
    <>
      <ViewHeader title="Danh sách kho" actions={[
        <CustomButton key="create-warehouse" label="Tạo kho"  onClick={()=>setCurrentModal(ModalEnum.CREATE_WAREHOUSE_MODAL)}/>
      ]}/>
      <WarehousesTable/>
      <CreateWarehouseModal open={currentModal === ModalEnum.CREATE_WAREHOUSE_MODAL} onClose={() => setCurrentModal(ModalEnum.CLOSE_MODAL)}/>
    </>
  );
}
