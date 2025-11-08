import { TokensType } from "../../auths";
import { ResponseItemDto } from "../../cores/dtos/response-item.dto";
import { ResponseUserDto } from "../user/response-user.dto";

export interface ResponseLoginDto{
    user:ResponseUserDto,
    tokens:TokensType
}