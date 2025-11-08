import type { ResponseItemDto } from "../../common/dtos/response-item.dto";

export interface ResponseUserDto extends ResponseItemDto {
  id: number;
  fullname: string;
  username: string;
  email: string;
  role?: string;
  permissions?:string[]
}
