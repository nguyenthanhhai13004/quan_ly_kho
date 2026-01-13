import CustomModal, { type CustomModalProps } from "../../components/common/custom-modal";
import CustomTable from "../../components/common/custom-table";
import type { EditChange } from "../../types/log.type";

type LogEditChangeDetailModalProps = CustomModalProps & {
    edit_changes: EditChange[] | null;
}
export default function LogEditChangeDetailModal({edit_changes,onClose,open}:LogEditChangeDetailModalProps){
    if (!edit_changes) return;
    const columns = ["Trường","Giá trị cũ","Giá trị mới"]
    return <CustomModal
        title="Chi tiết thay đổi"
        width="w-4xl"
        onClose={onClose}
        open={open}
    >
        <CustomTable columns={columns}
        data={edit_changes?.map((ed)=>[
            ed.field,
            ed.old_value,
            ed.new_value
        ])||[]}
        />
    </CustomModal>
}