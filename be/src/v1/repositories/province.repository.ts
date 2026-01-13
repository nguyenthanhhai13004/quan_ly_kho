import BaseRepository from "./base.repository";
import { Province } from "../models/province.model";

class ProvinceRepository extends BaseRepository<Province> {
  constructor() {
    super("provinces");
  }
}

export default new ProvinceRepository();