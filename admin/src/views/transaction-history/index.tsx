import ViewHeader from "../view-header";
import TransactionsHistoryTable from "./transactions-history-table";

export default function TransactionsHistoryView() {
  return (
    <>
      <ViewHeader
        title="Lịch sử giao dịch"
      />
      <TransactionsHistoryTable />
    </>
  );
}
