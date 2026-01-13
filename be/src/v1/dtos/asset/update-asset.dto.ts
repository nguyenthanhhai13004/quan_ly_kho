import Joi from "joi";
import AssetStatusEnum from "../../cores/enums/assets-status.enum";

export const UpdateAssetSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Tên tài sản là bắt buộc",
    "string.min": "Tên tài sản phải có ít nhất 2 ký tự",
    "string.max": "Tên tài sản không được vượt quá 100 ký tự",
  }),

  category_id: Joi.number().required().messages({
    "any.required": "Danh mục là bắt buộc",
  }),

  description: Joi.string().allow(null, "").max(255).messages({
    "string.max": "Mô tả không được vượt quá 255 ký tự",
  }),


  cost: Joi.number().allow(null).min(0).messages({
    "number.base": "Giá trị phải là số",
    "number.min": "Giá trị không được nhỏ hơn 0",
  }),
});

export interface UpdateAssetDto {
  name: string;
  category_id: number;
  description?: string;
  file?: Express.Multer.File;
}
