import provinceRepository from "../repositories/province.repository";
import wardRepository from "../repositories/ward.repository";

class AdministrativeService {
    static async getAllProvinces(){
        return await provinceRepository.findAll();
    }

    static async getWardsByProvince(province_code:string){
        return await wardRepository.findByCondition({
            province_code
        })
    }
}

export default AdministrativeService;