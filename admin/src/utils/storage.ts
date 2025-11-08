import Cookies from "js-cookie";
import type { TokensType } from "../common/types/tokens.type";

const ACCESS_TOKEN = "Authorization";
const REFRESH_TOKEN = "x-refresh-token";
const WAREHOUSE_ID = "x-warehouse-id";

export function saveTokens(tokens: TokensType) {
  Cookies.set(ACCESS_TOKEN, tokens.access_token);
  Cookies.set(REFRESH_TOKEN, tokens.refresh_token);
}

export function getTokens(): TokensType | null {
  const access_token = Cookies.get(ACCESS_TOKEN);
  const refresh_token = Cookies.get(REFRESH_TOKEN);
  if (!access_token || !refresh_token) {
    return null;
  }
  return {
    access_token,
    refresh_token,
  };
}

export function getWarehouseId():number|null{
  return Cookies.get(WAREHOUSE_ID) ? Number( Cookies.get(WAREHOUSE_ID)) : null;
}

export function setWarehouseId(warehouse_id:number){
  Cookies.set(WAREHOUSE_ID,String(warehouse_id));
}

export function removeWarehouseId(){
  Cookies.remove(WAREHOUSE_ID);
}


export function removeTokens() {
  Cookies.remove(ACCESS_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
}
