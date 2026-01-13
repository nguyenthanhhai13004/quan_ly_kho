import Joi from "joi";

export const CreateUserSchema = Joi.object({
  username: Joi.string()
    .min(6)
    .max(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.min": "Username phải có ít nhất 6 ký tự",
      "string.max": "Username không vượt quá 20 ký tự",
      "string.pattern.base":
        "Username chỉ được chứa chữ cái, số và dấu gạch dưới",
    }),
  role_id: Joi.required(),
  fullname: Joi.string().required(),
  email: Joi.string().required().email(),
  phone_number: Joi.string().optional(),
  warehouse_ids: Joi.array().items(Joi.number()).optional().messages({
    "array.base": "warehouse_ids phải là một mảng",
    "array.includes": "warehouse_ids chỉ chứa giá trị dạng số",
  }),
});

export interface CreateUserDto {
  username: string;
  email: string;
  fullname: string;
  role_id: number;
  warehouse_ids?: number[];
  phone_number?:string;
}
