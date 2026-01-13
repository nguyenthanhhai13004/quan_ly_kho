import { ObjectSchema } from "joi";
import {
  BadRequestError,
  UnsupportedMediaTypeError,
} from "../cores/error.response";
import { NextFunction, Request, Response } from "express";
import { MEDIA_TYPE } from "../cores/constants/media-type.constant";

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // if (!req.is(MEDIA_TYPE.JSON) || !req.is(MEDIA_TYPE.FORM_URLENCODED)) {
    //   throw new UnsupportedMediaTypeError();
    // }
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((d) => d.message);
      throw new BadRequestError(errors.toString());
    }
    req.body = value;
    next();
  };
};
