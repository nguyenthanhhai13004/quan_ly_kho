import { PiPlus } from "react-icons/pi";
import CustomButton from "../../components/common/custom-button";
import { useModalProvider } from "../../providers/modal-provider";
import { ModalEnum } from "../../constants/modals.constant";
import CategoriesTable from "./category-table";
import CreateCategoryModal from "./modals/create-category-modal";

export default function CategoryView() {
  const { currentModal, setCurrentModal } =
    useModalProvider();
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-semibold py-3">Quản lý danh mục</h2>
        <div className="flex gap-2">
          <CustomButton
            onClick={() => setCurrentModal(ModalEnum.CREATE_CATEGORY_MODAL)}
            label="Tạo mới"
            icon={<PiPlus size={20} />}
          />
        </div>
      </div>
      <CategoriesTable />
      <>
        <CreateCategoryModal
          open={ModalEnum.CREATE_CATEGORY_MODAL === currentModal}
          onClose={() => setCurrentModal(ModalEnum.CLOSE_MODAL)}
        />
      </>
    </>
  );
}
