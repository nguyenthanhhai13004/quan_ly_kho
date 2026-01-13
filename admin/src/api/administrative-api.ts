// https://nominatim.openstreetmap.org/search?amenity=Ba%20Dinh&city=Ha%20Noi&polygon_geojson=1&format=jsonv2
import axios from "axios";
import type { ApiResponseDto } from "../common/dtos/api-response.dto";
import api from "../libs/api";

class AdministrativeApi {
  static async getAllProvinces(): Promise<ApiResponseDto<any>> {
    const response = await api.get("/v1/administrative/provinces");
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  static async getAllWardByProvince(provinceCode:string): Promise<ApiResponseDto<any>> {
    const response = await api.get(`/v1/administrative/provinces/${provinceCode}/wards`);
    return {
      data: response.data.data,
      message: response.data.message,
      status: response.status,
    };
  }

  // =>
  //https://nominatim.openstreetmap.org/search?q=Tuy%20Ph%C6%B0%E1%BB%9Bc%20%C4%90%C3%B4ng&polygon_geojson=1&format=jsonv2
  static async getNominatimSearch(q:string){
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${q}&polygon_geojson=1&format=jsonv2`);
    return response.data;
  }
}
export default AdministrativeApi;
