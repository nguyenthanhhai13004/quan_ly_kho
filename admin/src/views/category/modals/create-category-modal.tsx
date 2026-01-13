import CustomInput from "../../../components/common/custom-input";
import CustomModal, {
  type CustomModalProps,
} from "../../../components/common/custom-modal";
import CustomButton from "../../../components/common/custom-button";
import CustomTextarea from "../../../components/common/custom-textarea";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { MdOutlineMotionPhotosAuto } from "react-icons/md";
import CustomIcon from "../../../components/common/custom-icon";
import { get, useForm } from "react-hook-form";
import {
  CreateCategorySchema,
  type CreateCategoryData,
} from "../../../dtos/category/create-category.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCategory } from "../../../queries/category.query";
import { toast } from "react-toastify";
import generateCodeCategory from "../../../utils/generate-code-category";
export default function CreateCategoryModal({
  open,
  onClose,
}: CustomModalProps) {
  const [color, setColor] = useState("#aabbcc");
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setError,
    setValue
  } = useForm<CreateCategoryData>({
    resolver: zodResolver(CreateCategorySchema),
  });
  const { mutate } = useCreateCategory();
  const onSubmit = (data: CreateCategoryData) => {
    mutate(
      { createCategoryDto: {
        ...data,
        color
      } },
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
  const handleGenerateCode = () =>{
    const categoryName = getValues("name");
    if (!categoryName){
      setError("code",{message:"Không thể tạo khi chưa có tên danh mục"});
    }
    const newCode = generateCodeCategory(categoryName);
    setValue("code",newCode)
  }
  return (
    <CustomModal
      width="max-w-xl"
      title="Tạo danh mục"
      onClose={onClose}
      open={open}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-1 border-b mb-2 border-gray-300 pt-3">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="mb-5">
                <CustomInput
                  {...register("code")}
                  labelType="top"
                  required
                  label="Mã danh mục"
                  error={errors?.code?.message}
                  icon={
                    <CustomIcon
                      label="Tạo tự động"
                      variant="info"
                      onClick={handleGenerateCode}
                      icon={<MdOutlineMotionPhotosAuto size={16} />}
                    />
                  }
                />
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
          <CustomButton type="submit" label="Tạo mới" size="sm" />
        </div>
      </form>
    </CustomModal>
  );
}
