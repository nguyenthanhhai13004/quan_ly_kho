import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import CustomButton from "../../../components/common/custom-button";
import CustomTextarea from "../../../components/common/custom-textarea";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import type { TCategory } from "../../../types/category.type";
import { useForm } from "react-hook-form";
import {
  UpdateCategorySchema,
  type UpdateCategoryData,
} from "../../../dtos/category/update-category.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateCategory } from "../../../queries/category.query";
import { toast } from "react-toastify";

type UpdateCategoryModalProps = CustomModalProps & {
  category: TCategory | null;
};

export default function UpdateCategoryModal({
  open,
  onClose,
  category,
}: UpdateCategoryModalProps) {
  if (!category) return;
  const [color, setColor] = useState(category.color || "#aabbcc");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCategoryData>({
    resolver: zodResolver(UpdateCategorySchema),defaultValues:{
      color:category.color,
      description:category.description,
      name:category.name,
    }
  });
  const { mutate } = useUpdateCategory();
  const onSubmit = async (data: UpdateCategoryData) => {
    mutate(
      {
        updateCategoryDto: {
          ...data,
          color,
          id:category.id
        },
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message, {
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
      width="max-w-xl"
      title="Cập nhật danh mục"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="mb-5">
                <CustomInput value={category.code} disabled labelType="top" required label="Mã danh mục" />
              </div>
              <div className="mb-5">
                <CustomInput
                  {...register("name")}
                  error={errors?.name?.message}
                  labelType="top"
                  required
                  label="Tên danh mục"
                />
              </div>
              <div className="mb-5">
                <CustomTextarea
                  {...register("description")}
                  error={errors?.description?.message}
                  labelType="top"
                  label="Mô tả"
                />
              </div>
            </div>
            <div className="relative">
              <span className="inline-block rounded-2xl absolute text-xs bg-[#F5F4F9] text-gray-700 top-[-5%] px-2 z-10 left-0">
                Chọn màu
              </span>
              <HexColorPicker color={color} onChange={setColor} />
            </div>
          </div>
        </div>
        <div className="text-right">
          <CustomButton type="submit" label="Cập nhật" size="sm" />
        </div>
      </form>
    </CustomModal>
  );
}
