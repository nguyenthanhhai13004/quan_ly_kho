import CustomCheckbox from "../../components/common/custom-checkbox";
import CustomTable from "../../components/common/custom-table";
import { useAllPermissions, useAllRoles } from "../../queries/rbac.query";

export default function AccessRightTable(){
    const {roles} = useAllRoles();
    const {permissions} = useAllPermissions();
    const columns = [<span className="inline-block font-semibold">Chức năng</span>,...roles?.map((r)=><span className="inline-block font-semibold">{r.name}</span>)||[]]
    const data = permissions?.map((p)=>[<span className="inline-block font-semibold">{p.name}</span>,...roles?.map((r)=><CustomCheckbox id={`${r.id}-${p.id}`} checked={r.permission_ids?.includes(p.id)}/>)||[]]) || [];
    return (
        <CustomTable
            striped
            columns={columns}
            data={data}
        />
    )
}