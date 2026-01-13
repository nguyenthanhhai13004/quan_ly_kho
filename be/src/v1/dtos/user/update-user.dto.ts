import Joi from "joi";
import UserStatusEnum from "../../cores/enums/user-status.enum";

export const UpdatedUserSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().required().email(),
  active: Joi.number().required().default(UserStatusEnum.ACTIVE),
  phone_number: Joi.string().optional(),
  warehouse_ids: Joi.array().items(Joi.number()).optional().messages({
    "array.base": "warehouse_ids phải là một mảng",
    "array.includes": "warehouse_ids chỉ chứa giá trị dạng số"
  })
});

export interface UpdatedUserDto {
  email: string;
  fullname: string;
  active: UserStatusEnum;
  id: number;
  phone_number?: string;
  warehouse_ids: number[];
}
