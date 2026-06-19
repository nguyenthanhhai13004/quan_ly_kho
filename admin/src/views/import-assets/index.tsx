import AssetInModalTable from "../tables/assets-in-modal-table";
import ImportManualForm from "./import-manual-form";

export type ImportAssetsViewProps = {
  onClose?: () => void;
  requestId?: number;
  filterAssetIds?: number[];
};

export default function ImportAssetsView({
  onClose,
  requestId,
  filterAssetIds,
}: ImportAssetsViewProps = {}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 bg-gray-200 p-2 rounded-2xl">
          <AssetInModalTable inModal={true} filterAssetIds={filterAssetIds}/>
        </div>
        <div className="col-span-1 bg-gray-200 p-4 pt-5 rounded-2xl">
          <ImportManualForm onClose={onClose} requestId={requestId} />
        </div>
      </div>
    </>
  );
}
