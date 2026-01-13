import { IBaseModelAttributes } from "../cores/base.model";

export interface Address extends IBaseModelAttributes {
  id: number;
  // province_code: string;
  // ward_code: string;
  address_detail: string;
  latitude: number | null;
  longitude: number | null;
}
