import { WAREHOUSE_TRANSACTIONS_TABLE_NAME } from "../cores/constants/table-name.constant";
import { WarehouseTransactions } from "../models/warehouse-transactions.model";
import { Warehouse } from "../models/warehouse.model";
import BaseRepository from "./base.repository";

class WarehouseTranSactionsRepository extends BaseRepository<WarehouseTransactions> {
  constructor() {
    super(WAREHOUSE_TRANSACTIONS_TABLE_NAME);
  }
}
export default new WarehouseTranSactionsRepository();
