import ViewHeader from "../view-header";
import LogsTable from "./logs-table";

export default function LogsView(){
    return <>
        <ViewHeader title="Lịch sử hoạt động"/>
        <LogsTable/>
    </>
}