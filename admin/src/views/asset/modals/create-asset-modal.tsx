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
import {
  CreateAssetSchema,
  type CreateAssetData,
} from "../../../dtos/asset/create-asset.dto";
import { toast } from "react-toastify";
import { useEffect, useState, type ChangeEvent } from "react";
import { useCreateAsset, useGenerateCode } from "../../../queries/asset.query";
import { usePaginationParams } from "../../../hooks/use-pagination-params";
import type { PaginationAssetsDto } from "../../../dtos/asset/pagination-assets.dto";
import { useAllCategories } from "../../../queries/category.query";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";
import CustomIcon from "../../../components/common/custom-icon";
export default function CreateAssetModal({ open, onClose }: CustomModalProps) {
  const [image, setImage] = useState<File | undefined>();
  const { params } = usePaginationParams<PaginationAssetsDto>();
  const { mutate: generateCode } = useGenerateCode();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<CreateAssetData>({
    resolver: zodResolver(CreateAssetSchema),
  });
  const { categories } = useAllCategories();
  const { mutate } = useCreateAsset();
  const onSubmit = (data: CreateAssetData) => {
    const { category_id, code, name, description } = data;
    mutate(
      {
        createAssetDto: {
          category_id,
          code,
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
  const handleGenerateCodeByCategory = async (category_id: number) => {
    if (!category_id) return;
    generateCode(category_id, {
      onSuccess: ({ data }) => {
        setValue("code", data);
      },
    });
  };
  //  useEffect(() => {
  //     const category_id = getValues("category_id");
  //     if (category_id) {
  //       handleGenerateCodeByCategory(category_id);
  //     }
  //   }, [getValues("category_id"), open]);
  useEffect(() => {
    if (!open) return;

    reset({
      category_id: undefined,
      code: "",
      name: "",
      description: "",
    });

    setImage(undefined);
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    if (!categories?.items?.length) return;

    const first = categories.items[0].id;

    setValue("category_id", first);
    handleGenerateCodeByCategory(first);
  }, [open, categories, setValue]);

  return (
    <CustomModal
      width="max-w-3xl"
      title="Tạo tài sản"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="grid grid-cols-2 gap-2 ">
            <div className="mb-3">
              <div className="grid grid-cols-2 gap-2">
                <CustomInput
                  {...register("code")}
                  error={errors?.code?.message}
                  labelType="top"
                  required
                  disabled
                  placeholder="VK-001"
                  label="Mã tài sản"
                  icon={
                    <CustomIcon
                      onClick={() =>
                        handleGenerateCodeByCategory(getValues("category_id"))
                      }
                      label="Tạo mã code"
                      variant="info"
                      icon={<MdOutlineMotionPhotosAuto size={16} />}
                    />
                  }
                />
                <CustomSelect
                  required
                  {...register("category_id", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  defaultValue={categories?.items && categories?.items[0].id}
                  error={errors?.category_id?.message}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleGenerateCodeByCategory(Number(e.target.value))
                  }
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
              <CustomImageInput required onChange={(file) => setImage(file)} />
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
