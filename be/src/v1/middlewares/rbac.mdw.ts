import { NextFunction, Request, Response } from "express";
import { PermissionsEnum } from "../cores/enums/permissons.enum";
import { ForbiddenError } from "../cores/error.response";
import permissionRepository from "../repositories/permission.repository";

export const grantAccess = (requiredPermissions: PermissionsEnum[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const roleId = req?.user.role_id;
            if (!roleId){
                throw new ForbiddenError();
            }
            // find all permssions from role
            const userPermissions = (await permissionRepository.findAllByRoleId(Number(roleId))).map((per)=>per.code);
            
            // check permssions with PermissionsEnum
            const hasPermission = requiredPermissions.every((perm)=>userPermissions.includes(perm));
            
            if (!hasPermission){
                throw new ForbiddenError();
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

export const grantAccessAny = (requiredPermissions: PermissionsEnum[])=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const roleId = req?.user.role_id;
            if (!roleId){
                throw new ForbiddenError();
            }
            const userPermissions = (await permissionRepository.findAllByRoleId(Number(roleId))).map((per)=>per.code);
            
            const hasPermission = requiredPermissions.some((perm)=>userPermissions.includes(perm));
            
            if (!hasPermission){
                throw new ForbiddenError();
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}