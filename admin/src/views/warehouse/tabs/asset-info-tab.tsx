import CustomInput from "../../../components/common/custom-input";
import CustomSelect from "../../../components/common/custom-select";
import CustomTextarea from "../../../components/common/custom-textarea";
import { useDetailAsset } from "../../../queries/asset.query";
import getImgSrc from "../../../utils/get-img-src";
import type { AssetTabProps } from "./asset-allocations-return-tab";

export default function AssetInfoTab({ assetCode }: AssetTabProps) {
  const { asset } = useDetailAsset(assetCode);
  return (
    <div className="grid grid-cols-3 gap-4 h-[300px] mt-5">
      <div className="h-full">
        <img
          alt={asset?.name}
          className="w-full bg-gray-200 h-full rounded-2xl object-cover"
          src={getImgSrc(asset?.image_url || "")}
        />
      </div>
      <div className="bg-gray-200 col-span-2 rounded-2xl p-5">
        <div className="grid grid-cols-2 gap-4">
          <CustomInput
            disabled
            value={asset?.code}
            labelType="top"
            placeholder="VK-001"
            label="Mã tài sản"
          />
           <CustomInput
            labelType="top"
            value={asset?.name}
            disabled
            placeholder="Súng AK"
            label="Tên"
          />
          <CustomInput
            disabled
            value={asset?.category.name}
            labelType="top"
            placeholder="VK-001"
            label="Danh mục"
          />
          <CustomTextarea
            labelType="top"
            label="Mô tả"
            disabled
            value={asset?.description}
            placeholder="Mô tả chi tiết tài sản ..."
          />
        </div>
      </div>
    </div>
  );
}
