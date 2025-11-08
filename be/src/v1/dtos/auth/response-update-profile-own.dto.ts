import { TokensType } from "../../auths";
import { ResponseUserDto } from "../user/response-user.dto";

export interface ResponseUpdateProfileOwnDto{
    user:ResponseUserDto,
    tokens:TokensType
}