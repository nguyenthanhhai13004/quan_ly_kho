import JWT from "jsonwebtoken";
import { JWT_SECURE_KEY } from "../cores/constants/app.constant";
import { HEADERS } from "../cores/constants/headers.constants";
import { UnauthorizedError } from "../cores/error.response";
import { NextFunction, Request, Response } from "express";
import userRepository from "../repositories/user.repository";
const ACCESS_TOKEN_EXPIRESIN = "2 days";
const REFRESH_TOKEN_EXPIRESIN = "7 days";
export type CreateKeyPairType = {
  username: string;
  email: string;
  id: number;
  role_name: string;
  role_id:number;
  fullname: string;
  warehouse_ids?:number[];
};
export type TokensType = {
  access_token: string;
  refresh_token: string;
};
export const createKeyPair = async (
  payload: CreateKeyPairType,
): Promise<TokensType> => {
  const access_token = await JWT.sign(payload, JWT_SECURE_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRESIN,
  });

  const refresh_token = await JWT.sign(payload, JWT_SECURE_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRESIN,
  });

  return {
    access_token,
    refresh_token,
  };
};
export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.headers[HEADERS.AUTHORIZATION] as string;
    if (!accessToken) {
      throw new UnauthorizedError("access token is required");
    }
    const decoded = JWT.verify(
      accessToken,
      JWT_SECURE_KEY,
    ) as CreateKeyPairType;

    // check status user
    const isActive = await userRepository.userIsActive(decoded.id);

    if (!isActive){
      throw new UnauthorizedError("expired")
    }

    req.user = decoded;
    return next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("expired");
    }
    throw new UnauthorizedError(error.message || "invalid token");
  }
};
