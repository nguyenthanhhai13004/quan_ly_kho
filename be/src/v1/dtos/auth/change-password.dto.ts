import Joi from "joi"

export const ChangePasswordSchema = Joi.object({
  old_password: Joi.string().required().messages({
    "any.required": "Vui lòng nhập mật khẩu cũ",
    "string.empty": "Mật khẩu cũ không được để trống",
  }),

  new_password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .disallow(Joi.ref("old_password"))
    .required()
    .messages({
      "any.required": "Vui lòng nhập mật khẩu mới",
      "string.empty": "Mật khẩu mới không được để trống",
      "string.min": "Mật khẩu mới phải có ít nhất 8 ký tự",
      "string.pattern.base":
        "Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số",
      "any.invalid": "Mật khẩu mới không được trùng với mật khẩu cũ",
    }),
});

export interface ChangePasswordDto{
    old_password:string;
    new_password:string;
}