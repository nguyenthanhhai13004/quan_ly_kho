import CommanderClassesTable from "../../views/student/commander-classes-table";

export default function ClassesOwnPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-3xl font-semibold py-3">Lớp học quản lý</h2>
      </div>
      <CommanderClassesTable />
    </>
  );
}
