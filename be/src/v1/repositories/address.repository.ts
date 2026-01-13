import BaseRepository from "./base.repository";
import { Address } from "../models/address.model";

class AddressRepository extends BaseRepository<Address> {
  constructor() {
    super("address");
  }
}

export default new AddressRepository();