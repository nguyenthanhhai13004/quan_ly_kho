import Joi from "joi";

export const UpdateCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Tên danh mục là bắt buộc",
      "string.min": "Tên danh mục phải có ít nhất 2 ký tự",
      "string.max": "Tên danh mục không được vượt quá 50 ký tự",
    }),

  description: Joi.string()
    .allow(null, "")
    .max(255)
    .messages({
      "string.max": "Mô tả không được vượt quá 255 ký tự",
    }),

  color: Joi.string()
    .pattern(/^#([0-9A-Fa-f]{3}){1,2}$/)
    .required()
    .messages({
      "string.pattern.base": "Màu phải là mã hex hợp lệ (vd: #FF5733)",
      "any.required": "Vui lòng chọn màu cho danh mục",
    }),
});

export interface UpdateCategoryDto {
  name: string;
  description?: string;
  color: string;
}
