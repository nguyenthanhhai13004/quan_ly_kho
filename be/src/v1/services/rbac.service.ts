import { BadRequestError, InternalServerError } from "../cores/error.response";
import { CreateRoleDto } from "../dtos/rbac/create-role.dto";
import { ResponseRoleDto } from "../dtos/rbac/response-role.dto";
import { Permission } from "../models/permission.model";
import { Role } from "../models/role.model";
import permissionRepository from "../repositories/permission.repository";
import roleRepository from "../repositories/role.repository";
import { getInfoData } from "../utils/get-info-data";

class RbacService{
    static async createNewRole(createRoleDto:CreateRoleDto):Promise<ResponseRoleDto>{
        const roleFound = await roleRepository.findRoleByName(createRoleDto.name);

        if (roleFound){
            throw new BadRequestError("role này đã tồn tại")
        }

        const roleStore = await roleRepository.store({
            ...createRoleDto
        });

        if (!roleStore){
            throw new InternalServerError("có lỗi xảy ra, thử lại sau.")
        }

        return getInfoData<ResponseRoleDto>({
            fields:["name","description"],
            object:roleStore
        })
    }
    static async updateRole(){}
    static async getAllRoleWithPermissions(){}
    static async getAllRoles():Promise<Role[]>{
        return await roleRepository.findAll();
    }
    static async getAllPermissions():Promise<Permission[]>{
        return await permissionRepository.findAll();
    }
    static async getRoleDetail(){}
}
export default RbacService;