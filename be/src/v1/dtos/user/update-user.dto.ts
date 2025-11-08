import Joi from "joi";
import UserStatusEnum from "../../cores/enums/user-status.enum";

export const UpdatedUserSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().required().email(),
  active:Joi.number().required().default(UserStatusEnum.ACTIVE)
});

export interface UpdatedUserDto {
  email: string;
  fullname: string;
  active:UserStatusEnum;
  id:number;
}
