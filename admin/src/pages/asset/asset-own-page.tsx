import { useState } from "react";
import ViewHeader from "../../views/view-header";
import { useAssetsOwn } from "../../queries/warehouse.query";
import CustomTable from "../../components/common/custom-table";
import CustomBadge from "../../components/common/custom-badge";
import CustomIcon from "../../components/common/custom-icon";
import dayjs from "dayjs";
import { FaEye } from "react-icons/fa";
import { AssetStatusEnum } from "../../common/enums/asset-status.enum";
import getImgSrc from "../../utils/get-img-src";
import FilterWrapper from "../../views/filter-wrapper";
import CustomInput from "../../components/common/custom-input";
import CustomSelect from "../../components/common/custom-select";
import CustomModal from "../../components/common/custom-modal";

function getStatusBadge(status: number) {
  if (status === AssetStatusEnum.GOOD)
    return <CustomBadge label="Tốt" status="success" />;
  if (status === AssetStatusEnum.BROKEN)
    return <CustomBadge label="Hỏng" status="error" />;
  if (status === AssetStatusEnum.MAINTENANCE)
    return <CustomBadge label="Bảo trì" status="warning" />;
  return <CustomBadge label="Khác" status="default" />;
}

export default function AssetOwnPage() {
  const { assets, isLoading } = useAssetsOwn();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // Filter states
  const [keywordDraft, setKeywordDraft] = useState("");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("");

  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleSearch = () => {
    setKeyword(keywordDraft);
    setSelectedCategory(categoryDraft);
    setSelectedStatus(statusDraft);
  };

  const handleReset = () => {
    setKeywordDraft("");
    setCategoryDraft("");
    setStatusDraft("");
    setKeyword("");
    setSelectedCategory("");
    setSelectedStatus("");
  };

  if (isLoading) {
    return (
      <>
        <ViewHeader title="Tài sản đang sở hữu" />
        <div className="text-center p-6 text-gray-500 font-semibold">Đang tải danh sách tài sản...</div>
      </>
    );
  }

  // Derive unique categories dynamically
  const uniqueCategories = Array.from(
    new Set(
      (assets || [])
        .map((asset: any) => asset.category?.name)
        .filter(Boolean)
    )
  ) as string[];

  // Filter logic in-memory
  const filteredAssets = (assets || []).filter((asset: any) => {
    const matchesKeyword =
      !keyword ||
      asset.asset_name.toLowerCase().includes(keyword.toLowerCase()) ||
      asset.asset_code.toLowerCase().includes(keyword.toLowerCase());

    const matchesCategory =
      !selectedCategory || asset.category?.name === selectedCategory;

    const matchesStatus =
      !selectedStatus ||
      asset.batches.some(
        (b: any) => !b.return_date && String(b.status) === selectedStatus
      );

    return matchesKeyword && matchesCategory && matchesStatus;
  });

  const columns = [
    "STT",
    "Hình ảnh",
    "Mã tài sản",
    "Tên tài sản",
    "Danh mục",
    "Kho cấp phát",
    "Tổng SL đang giữ",
    "Thao tác",
  ];

  // Build table data
  const tableData: React.ReactNode[][] = [];

  filteredAssets.forEach((asset: any, index: number) => {
    const activeBatches = asset.batches.filter((b: any) => !b.return_date);
    const totalQuantity = activeBatches.reduce((sum: number, b: any) => sum + b.quantity, 0);

    // Main row
    tableData.push([
      index + 1,
      <img
        src={getImgSrc(asset.asset_image_url)} 
        alt={asset.asset_name}
        className="w-10 h-10 object-cover rounded-lg border border-gray-200"
      />,
      <span className="font-medium text-blue-600">{asset.asset_code}</span>,
      <span className="font-semibold">{asset.asset_name}</span>,
      asset.category?.name || "---",
      asset.warehouse_name || "---",
      <span className="font-bold">{totalQuantity}</span>,
      <CustomIcon
        icon={<FaEye size={20} className="text-blue-600" />}
        label="Xem chi tiết"
        onClick={() => setSelectedAsset(asset)}
      />,
    ]);
  });

  const filterComponent = (
    <FilterWrapper onSubmit={handleSearch} onReset={handleReset}>
      <CustomSelect
        labelType="top"
        placeholder="Tất cả danh mục"
        className="min-w-[150px] w-full rounded-2xl"
        searchable
        options={uniqueCategories.map((cat) => ({ label: cat, value: cat }))}
        value={categoryDraft}
        onChange={(e) => setCategoryDraft(e.target.value)}
        label="Danh mục"
      />
      <CustomSelect
        labelType="top"
        placeholder="Tất cả tình trạng"
        className="min-w-[150px] w-full rounded-2xl"
        customDropdown
        options={[
          { label: "Tốt", value: String(AssetStatusEnum.GOOD) },
          { label: "Hỏng", value: String(AssetStatusEnum.BROKEN) },
          { label: "Bảo trì", value: String(AssetStatusEnum.MAINTENANCE) },
        ]}
        label="Tình trạng"
        value={statusDraft}
        onChange={(e) => setStatusDraft(e.target.value)}
      />
      <CustomInput
        className="min-w-[200px] w-full"
        placeholder="Tìm theo tên hoặc mã tài sản..."
        value={keywordDraft}
        onChange={(e) => setKeywordDraft(e.target.value)}
      />
    </FilterWrapper>
  );

  return (
    <>
      <ViewHeader title="Tài sản đang sở hữu" />
      <CustomTable
        title="Danh sách tài sản được cấp phát"
        filter={filterComponent}
        columns={columns}
        data={tableData}
      />

      <CustomModal
        open={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
        title={`Chi tiết cấp phát: ${selectedAsset?.asset_name || ""}`}
        width="max-w-5xl"
        height="max-h-[85vh]"
      >
        {selectedAsset && (
          <div className="flex flex-col gap-4 p-1">
            <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
              <img
                src={getImgSrc(selectedAsset.asset_image_url)}
                alt={selectedAsset.asset_name}
                className="w-20 h-20 object-cover rounded-xl border border-gray-200"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedAsset.asset_name}</h3>
                <p className="text-sm text-gray-500">Mã tài sản: <span className="font-semibold text-blue-600">{selectedAsset.asset_code}</span></p>
                <p className="text-sm text-gray-500">Danh mục: {selectedAsset.category?.name || "---"}</p>
                <p className="text-sm text-gray-500">Kho cấp phát: {selectedAsset.warehouse_name || "---"}</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs">
                  <tr>
                    <th className="px-4 py-3">Mã lô</th>
                    <th className="px-4 py-3">Tên tài sản</th>
                    <th className="px-4 py-3">Ngày cấp phát</th>
                    <th className="px-4 py-3">Ngày thu hồi</th>
                    <th className="px-4 py-3">Hạn bảo trì</th>
                    <th className="px-4 py-3 text-center">Số lượng</th>
                    <th className="px-4 py-3 text-right">Tình trạng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {selectedAsset.batches.map((batch: any, index: number) => {
                    const isReturned = !!batch.return_date;
                    return (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-mono font-medium text-gray-600">
                          {batch.batch_code}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          {selectedAsset.asset_name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {batch.allocation_date ? dayjs(batch.allocation_date).format("DD/MM/YYYY") : "---"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {isReturned ? (
                            <span className="text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full text-xs">
                              {dayjs(batch.return_date).format("DD/MM/YYYY")}
                            </span>
                          ) : !batch.return_deadline ? (
                            <span className="text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                              Không thu hồi
                            </span>
                          ) : (
                            <span className="text-gray-400">Chưa thu hồi</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {batch.maintenance_due ? dayjs(batch.maintenance_due).format("DD/MM/YYYY") : "Không có"}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-gray-800">
                          {batch.quantity}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-col gap-1 items-end">
                            {isReturned ? (
                              <CustomBadge label="Đã thu hồi" status="default" />
                            ) : (
                              getStatusBadge(batch.status)
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CustomModal>
    </>
  );
}
