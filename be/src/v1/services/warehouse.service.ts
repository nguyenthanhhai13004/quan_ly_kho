import { PaginationDto } from "../cores/dtos/pagination.dto";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import { InternalServerError, NotFoundError } from "../cores/error.response";
import { ManualImportToWarehouseDto } from "../dtos/warehouse/manual-import-to-warehouse.dto";
import { Warehouse } from "../models/warehouse.model";
import assetRepository from "../repositories/asset.repository";
import warehouseAssetRepository from "../repositories/warehouse-asset.repository";
import warehouseTransactionsRepository from "../repositories/warehouse-transactions.repository";
import warehouseRepository from "../repositories/warehouse.repository";

export interface ImportWarehouseFromExcelDto {
  asset_code: number;
  asset_name: number;
  category_name: number;
  quantity: number;
  cost: number;
  import_date: Date;
  note: string;
  maintenance_due: Date;
}

class WarehouseService {
  static async manualImportToWarehouse(
    manualImportToWarehouseDto: ManualImportToWarehouseDto,
  ) {
    const { asset_id, import_date, note, quantity, reason, warehouse_id } =
      manualImportToWarehouseDto;
    const assetFound = await assetRepository.findById(asset_id);
    if (!assetFound) {
      throw new NotFoundError("tài sản không tồn tại");
    }
    const wareHouseFound = await warehouseRepository.findById(warehouse_id);
    if (!wareHouseFound) {
      throw new NotFoundError("kho không tồn tại");
    }

    // create transactions
    const newTransaction = await warehouseTransactionsRepository.create({
        asset_id,
        note,
        reason,
        warehouse_id
    });

    if (!newTransaction){
        throw new InternalServerError("có lỗi xảy ra, thử lại sau.");
    }
    
    return await warehouseAssetRepository.addQuantityAssetToWarehouse({
      asset_id,
      warehouse_id,
      quantity,
    });
  }
  static async importWarehouseFromExcel() {}
  static async manualExportFromWarehouse() {}
  static async exportWarehouseFromExcel() {}
  static async getAllWarehouseOwn(userId:number,paginationDto:PaginationDto):Promise<ResponsePaginationDto<Warehouse>>{
    return await warehouseRepository.findAllOwn(userId,paginationDto);
  }
}

export default WarehouseService;
