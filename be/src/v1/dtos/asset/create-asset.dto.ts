import Joi from "joi";
import AssetStatusEnum from "../../cores/enums/assets-status.enum";

export const CreateAssetSchema = Joi.object({
  code: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Mã tài sản là bắt buộc",
      "string.min": "Mã tài sản phải có ít nhất 2 ký tự",
      "string.max": "Mã tài sản không được vượt quá 50 ký tự",
    }),

  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Tên tài sản là bắt buộc",
      "string.min": "Tên tài sản phải có ít nhất 2 ký tự",
      "string.max": "Tên tài sản không được vượt quá 100 ký tự",
    }),

  category_id: Joi.number()
    .required()
    .messages({
      "any.required": "Danh mục là bắt buộc",
    }),

     warehouse_id: Joi.number()
    .required()
    .messages({
      "any.required": "Kho là bắt buộc",
    }),

  description: Joi.string()
    .allow(null, "")
    .max(255)
    .messages({
      "string.max": "Mô tả không được vượt quá 255 ký tự",
    }),

  quantity: Joi.number()
    .min(0)
    .required()
    .messages({
      "number.base": "Số lượng phải là số",
      "number.min": "Số lượng không được nhỏ hơn 0",
      "any.required": "Số lượng là bắt buộc",
    }),

  cost: Joi.number()
    .allow(null)
    .min(0)
    .messages({
      "number.base": "Giá trị phải là số",
      "number.min": "Giá trị không được nhỏ hơn 0",
    }),

  status: Joi.string()
    .valid(...Object.values(AssetStatusEnum))
    .default(AssetStatusEnum.ACTIVE)
    .messages({
      "any.only":
        "Tình trạng chỉ có thể là: Tốt, Bảo trì, Lỗi, hoặc Thanh lý",
    }),

  maintenance_due: Joi.date()
    .allow(null)
    .messages({
      "date.base": "Hạn bảo trì không hợp lệ",
    }),

  image: Joi.string()
    .allow(null, "")
    .uri()
    .messages({
      "string.uri": "Hình ảnh phải là đường dẫn hợp lệ",
    }),
});

export interface CreateAssetDto {
  code: string;
  name: string;
  category_id: number;
  description?: string;
  quantity: number;
  cost: number;
  status: AssetStatusEnum;
  maintenance_due?: Date;
  image?: string;
  warehouse_id:number;
}
