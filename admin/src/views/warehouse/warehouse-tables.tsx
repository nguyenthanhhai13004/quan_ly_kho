import CustomTable from "../../components/common/custom-table";
import { useWarehouseAny } from "../../queries/warehouse.query";

export default function WarehousesTable() {
  const { warehouses } = useWarehouseAny();
  const columns = ["STT", "Mã kho", "Tên kho", "Người quản lý"];
  return (
    <>
      <CustomTable
        columns={columns}
        data={
          warehouses?.items.map((w, index: number) => [
            index + 1,
            w.code,
            w.name,
            <>
              {w.managers?.map((m) => (
                <div
                  key={m.id}
                  className="p-1 relative bg-gray-500 text-xs mr-2 cursor-pointer px-2 text-white inline-block shadow-2xl rounded-2xl group"
                >
                  {m.fullname}
                  <div
                    className="
      absolute left-0 top-full mt-1 z-10
      w-40 p-2 bg-blue-300 rounded-md shadow-lg
      opacity-0 invisible
      group-hover:opacity-100 group-hover:visible
      transition-all duration-200
    "
                  >
                    {m.email}
                  </div>
                </div>
              ))}
            </>,
          ]) || []
        }
      />
    </>
  );
}
