import AssetInModalTable from "../tables/assets-in-modal-table";
import ImportManualForm from "./import-manual-form";

export default function ImportAssetsView() {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 bg-gray-200 p-2 rounded-2xl">
          <AssetInModalTable/>
        </div>
        <div className="col-span-1 bg-gray-200 p-4 pt-5 rounded-2xl">
          <ImportManualForm />
        </div>
      </div>
    </>
  );
}
