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

  warehouse_id: Joi.number().required().messages({
    "any.required": "Kho là bắt buộc",
  }),

  description: Joi.string().allow(null, "").max(255).messages({
    "string.max": "Mô tả không được vượt quá 255 ký tự",
  }),


  cost: Joi.number().allow(null).min(0).messages({
    "number.base": "Giá trị phải là số",
    "number.min": "Giá trị không được nhỏ hơn 0",
  }),

  status: Joi.string()
    .valid(...Object.values(AssetStatusEnum))
    .default(AssetStatusEnum.ACTIVE)
    .messages({
      "any.only": "Tình trạng chỉ có thể là: Tốt, Bảo trì, Lỗi, hoặc Thanh lý",
    }),

  maintenance_due: Joi.date().allow(null).messages({
    "date.base": "Hạn bảo trì không hợp lệ",
  }),

  image: Joi.string().allow(null, "").uri().messages({
    "string.uri": "Hình ảnh phải là đường dẫn hợp lệ",
  }),
});

export interface UpdateAssetDto {
  name: string;
  category_id: number;
  description?: string;
  cost: number;
  status: AssetStatusEnum;
  maintenance_due?: Date;
  image?: string;
  warehouse_id: number;
}
