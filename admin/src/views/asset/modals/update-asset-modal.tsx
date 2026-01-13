import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import CustomImageInput from "../../../components/common/custom-input-image";
import CustomTextarea from "../../../components/common/custom-textarea";
import { getWarehouseId } from "../../../utils/storage";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  UpdateAssetSchema,
  type UpdateAssetData,
} from "../../../dtos/asset/update-asset.dto";
import getImgSrc from "../../../utils/get-img-src";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import { useDetailAsset, useUpdateAsset } from "../../../queries/asset.query";
import type { PaginationAssetsDto } from "../../../dtos/asset/pagination-assets.dto";
import { useAllCategories } from "../../../queries/category.query";

interface UpdateAssetModalProps extends CustomModalProps {
  assetId: number | null;
  assetCode:string|null
}
export default function UpdateAssetModal({
  open,
  onClose,
  assetId,
  assetCode
}: UpdateAssetModalProps) {
  const [image, setImage] = useState<File | undefined>();
  const {params} = usePaginationParams<PaginationAssetsDto>();
  const { asset } = useDetailAsset(assetCode);

  const {
    register,
    handleSubmit,
    formState: { errors ,isDirty},
    reset,
    watch
  } = useForm<UpdateAssetData>({
    resolver: zodResolver(UpdateAssetSchema),
  });
  const { categories } = useAllCategories();
  const { mutate } = useUpdateAsset();
 useEffect(() => {
  if (asset) {
    const { category, name, description } = asset;
    reset({
      category_id: category.id,
      name,
      description,
    });
  }
}, [asset, reset]);
  const onSubmit = (data: UpdateAssetData) => {
    const { category_id, name, description } = data;
    const warehouse_id = getWarehouseId();
    if (!warehouse_id || !assetId) return;
    mutate(
      {
        assetId,
        updateAssetDto: {
          category_id,
          name,
          description,
          image,
        },
        paginationDto: params,
      },
      {
        onSuccess: ({ message }) => {
          toast.info(message, {
            progress: undefined,
            hideProgressBar: true,
            autoClose: 1000,
          });
          onClose();
          reset();
        },
      },
    );
  };
  const isChanged = isDirty || image !== undefined;
  return (
    <CustomModal
      width="max-w-2xl"
      title="Chỉnh sửa thông tin tài sản"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="grid grid-cols-2 gap-2 ">
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-2">
                <CustomInput
                  disabled
                  value={asset?.code}
                  labelType="top"
                  placeholder="VK-001"
                  label="Mã tài sản"
                />
                 <CustomSelect
                  required
                  {...register("category_id", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  defaultValue={categories?.items && categories?.items[0].id}
                  error={errors?.category_id?.message}
                  labelType="top"
                  label="Danh mục"
                  options={
                    categories?.items?.map((r) => ({
                      label: r.name,
                      value: r.id,
                    })) || []
                  }
                />
              </div>
            </div>
            <div className="mb-3">
              <CustomInput
                {...register("name")}
                error={errors?.name?.message}
                labelType="top"
                required
                placeholder="Súng AK"
                label="Tên"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3">
            <div className="mb-3 col-span-1">
              <CustomImageInput
                defaultImage={getImgSrc(asset?.image_url || "")}
                required
                onChange={(file) => setImage(file)}
              />
            </div>
            <div className="mb-3 col-span-2">
              <CustomTextarea
                {...register("description")}
                error={errors?.description?.message}
                labelType="top"
                label="Mô tả"
                placeholder="Mô tả chi tiết tài sản ..."
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <CustomButton disabled={!isChanged} type="submit" label="Chỉnh sửa" size="sm" /> 
          {/* disable nút chỉnh sửa nếu không có gì thay đổi */}
        </div>
      </form>
    </CustomModal>
  );
}
