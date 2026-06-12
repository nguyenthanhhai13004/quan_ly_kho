import dayjs from "dayjs";
import CustomTable from "../../components/common/custom-table";
import type { PaginationLogsDto } from "../../dtos/log/pagination-logs.dto";
import { usePaginationParams } from "../../hooks/use-pagination-params";
import { useAllLogs } from "../../queries/log.query";
import CustomIcon from "../../components/common/custom-icon";
import { BsEye } from "react-icons/bs";
import { LogAction } from "../../constants/logs.constant";
import LogEditChangeDetailModal from "./log-edit-change-detail-modal";
import { useModalProvider } from "../../providers/modal-provider";

import LogsFilter from "./logs-filter";

export default function LogsTable() {
  const columns = [
    "Ngày tạo",
    "Username",
    "Action",
    "Controller",
    "IP",
    "url",
    "Data",
    "Hành động",
  ];
  const { params,setPage } = usePaginationParams<PaginationLogsDto>();
  const { logs } = useAllLogs(params);
  const { openModal } = useModalProvider();
  return (
    <>
      <CustomTable
        columns={columns}
        onPageChange={setPage}
        totalPages={logs?.totalPages}
        currentPage={params.page}
        filter={<LogsFilter/>}
        data={
          logs?.items.map((log) => [
            dayjs(log.created_at).format("DD/MM/YYYY HH:mm"),
            log.username,
            log.action_name?.toUpperCase(),
            log.controller_name,
            log.ip,
            log.url,
            <pre className="whitespace-pre-wrap break-all max-w-[300px]">
              {JSON.stringify(log.data, null, 2)}
            </pre>,
            log.action_name?.toUpperCase() == LogAction.EDIT && (log.data) && (
              <CustomIcon
                onClick={() =>
                 {
                  openModal(LogEditChangeDetailModal, { edit_changes: log.edit_changes });
                }}
                label="Chi tiết thay đổi"
                icon={<BsEye size={20} />}
              />
            ),
          ]) || []
        }
      />

    </>
  );
}
