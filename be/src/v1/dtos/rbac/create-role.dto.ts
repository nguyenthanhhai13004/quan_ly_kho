import Joi from "joi"

export const CreateRoleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, "").optional(),
});

export interface CreateRoleDto{
    name:string;
    description?:string;
}