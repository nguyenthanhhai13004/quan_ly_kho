import type { TokensType } from "../../common/types/tokens.type";
import type { ResponseUserDto } from "../user/response-user.dto";

export interface ResponseLoginDto {
  user: ResponseUserDto;
  tokens: TokensType;
}
