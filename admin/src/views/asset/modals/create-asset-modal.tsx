import { useForm } from "react-hook-form";
import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomSelect from "../../../components/common/custom-select";
import CustomButton from "../../../components/common/custom-button";
import { useAllCategories } from "../../../hooks/category/use-all-assets";
import { ASSET_STATUS } from "../../../constants/asset-status.constant";
import CustomImageInput from "../../../components/common/custom-input-image";
import CustomTextarea from "../../../components/common/custom-textarea";
import {
  CreateAssetSchema,
  type CreateAssetData,
} from "../../../dtos/asset/create-asset.dto";
import { AssetStatusEnum } from "../../../common/enums/asset-status.enum";
import { useCreateAsset } from "../../../hooks/asset/use-create-asset";
import { getWarehouseId } from "../../../utils/storage";
import { toast } from "react-toastify";
export default function CreateAssetModal({ open, onClose }: CustomModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAssetData>({
    resolver: zodResolver(CreateAssetSchema),
  });
  const { categories } = useAllCategories();
  const { mutate, error } = useCreateAsset();
  const onSubmit = (data: CreateAssetData) => {
    const { category_id, code, name, quantity, status, cost, description } =
      data;
    const warehouse_id = getWarehouseId();
    if (!warehouse_id) return;
    mutate(
      {
        createAssetDto: {
          category_id,
          code,
          name,
          quantity,
          status,
          warehouse_id,
          cost,
          description,
        },
      },
      {
        onSuccess: ({ data, message }) => {
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
  return (
    <CustomModal
      width="max-w-2xl"
      title="Tạo tài sản"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="grid grid-cols-2 gap-2 ">
            <div className="mb-3">
              <CustomInput
                {...register("code")}
                error={errors?.code?.message}
                labelType="top"
                required
                placeholder="VK-001"
                label="Mã tài sản"
              />
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
            <div className="mb-3">
              <CustomInput
                {...register("quantity", {
                  required: true,
                  valueAsNumber: true,
                })}
                error={errors?.quantity?.message}
                labelType="top"
                required
                type="Number"
                placeholder="ví dụ : 20"
                label="Số lượng"
              />
            </div>
            <div className="mb-3">
              <CustomInput
                {...register("cost", {
                  required: true,
                  valueAsNumber: true,
                })}
                error={errors?.cost?.message}
                labelType="top"
                required
                type="Number"
                placeholder="100000"
                label="Giá trị"
              />
            </div>
            <div className="mb-3">
              <div className="grid grid-cols-2 w-full">
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
                <CustomSelect
                  required
                  {...register("status", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  defaultValue={AssetStatusEnum.ACTIVE}
                  error={errors?.status?.message}
                  labelType="top"
                  className="min-w-[150px]"
                  options={ASSET_STATUS}
                  label="Tình trạng"
                />
              </div>
            </div>
            <div className="mb-3">
              <div className="grid grid-cols-2 w-full">
                <CustomInput
                  required
                  labelType="top"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  label="Ngày nhập"
                />
                <CustomInput labelType="top" type="date" label="Hạn bảo trì" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-3">
            <div className="mb-3 col-span-1">
              <CustomImageInput required />
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
          <CustomButton type="submit" label="Tạo mới" size="sm" />
        </div>
      </form>
    </CustomModal>
  );
}
