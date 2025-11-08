import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcrypt";
export const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const hashPassword = async (password:string) => {
  const SALT = Number(process.env.SALT||10);
  return await bcrypt.hash(password, SALT);
};

export const comparePassword = async (password:string,hashPassword:string)=>{
  return await bcrypt.compare(password,hashPassword); 
}
