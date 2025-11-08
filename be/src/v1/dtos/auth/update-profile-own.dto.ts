import Joi from "joi";

export const UpdateProfileOwnSchema = Joi.object({
  email: Joi.string().required().email(),
  fullname: Joi.string().required()
});

export interface UpdateProfileOwnDto{
    fullname:string;
    email:string;
}