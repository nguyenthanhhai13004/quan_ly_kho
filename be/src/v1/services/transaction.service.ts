import TransactionTypeEnum from "../cores/enums/transaction-type.enum";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../cores/error.response";
import { PaginationTransactionsDto } from "../dtos/transaction/pagination-transactions.dto";
import assetTransactionsRepository from "../repositories/asset-transactions.repository";
import * as XLSX from "xlsx";
import assetRepository from "../repositories/asset.repository";
import { ImportExcelDto } from "../dtos/transaction/import-excel.dto";
import generateTransactionCode from "../utils/generate-transaction-code";
import { parseUploadedFileColumns } from "../utils/parse-uploaded-file-columns";
import ImportManualDto from "../dtos/transaction/import-manual.dto";
import warehouseRepository from "../repositories/warehouse.repository";
import db from "../databases/init.mysql-v2";
import { AssetTransactions } from "../models/asset-transactions.model";
import warehouseAssetRepository from "../repositories/warehouse-asset.repository";
import CreateAllocationDto from "../dtos/transaction/create-allocation.dto";
import ProcessReturnDto from "../dtos/transaction/process-return.dto";
import CreateDisposalDto from "../dtos/transaction/create-disposal.dto";
import AssetStatusEnum from "../cores/enums/assets-status.enum";
import { generateBatchCode } from "../utils/generate-batch-code";
import { AssetTransactionItems } from "../models/asset-transaction-items.model";
import { excelToJsDate } from "../utils/excel-to-js-date";
import ExportManualDto from "../dtos/transaction/export-manual.dto";
import { ExportExcelDto } from "../dtos/transaction/export-excel.dto";
import normalizeDate from "../utils/normalize-date";
import CreateMaintenanceDto from "../dtos/transaction/create-maintenance";
import {
  ASSET_MAINTENANCES_TABLE_NAME,
  ASSET_TRANSACTION_ITEMS_TABLE_NAME,
  ASSET_TRANSACTIONS_TABLE_NAME,
  WAREHOUSE_ASSET_TABLE_NAME,
} from "../cores/constants/table-name.constant";
import MaintenanceStatusEnum from "../cores/enums/maintenance-status.enum";
import UpdateMaintenanceDto from "../dtos/transaction/update-maintenance.dto";
import { AssetMaintenances } from "../models/asset-maintenances";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";
import { PaginationTransactionsForAssetDto } from "../dtos/transaction/pagination-transactions-for-asset";
import { Request } from "express";

export type AssetImportRow = {
  "Mã tài sản": string;
  "Số lượng": number;
  "Hạn bảo trì": Date;
  "Giá trị": number;
  "Mã lô": string;
  "Ngày sản xuất": Date;
  "Hạn sử dụng": Date;
};

export type AssetExportRow = {
  "Mã lô": string;
  "Số lượng": number;
};

type TrendData = {
  id: string;
  data: { x: string; y: number }[];
};

class TransactionService {
  static async createAllocation(createAllocationDto: CreateAllocationDto) {
    const {
      allocation_date,
      items,
      created_by_user_id,
      name,
      receiver_id,
      warehouse_id,
      reason,
      note,
      return_deadline,
      code,
    } = createAllocationDto;
    return await db.transaction(async (trx) => {
      const trxFound = await trx("asset_transactions")
        .where("code", code)
        .first();
      if (trxFound)
        throw new BadRequestError("mã không hợp lệ, thử với mã khác");
      const resultTrans = await trx("asset_transactions").insert({
        code,
        name,
        reason,
        note,
        type: TransactionTypeEnum.ALLOCATION_RETURN,
        warehouse_id,
        created_by_user_id,
      });
      const transactionId = resultTrans[0];
      if (!transactionId)
        throw new InternalServerError("Không tạo được transaction");
      const transaction = await trx("asset_transactions")
        .where("id", transactionId)
        .first();
      await trx("asset_lifecycle").insert({
        transaction_id: transactionId,
        allocation_date,
        return_deadline: return_deadline ? return_deadline : null,
        created_by_user_id,
        receiver_id,
      });
      const insertedItems: any[] = [];
      for (const item of items) {
        const { batch_code, quantity } = item;
        const warehouseAsset = await trx("warehouse_asset")
          .where({
            warehouse_id,
            batch_code,
          })
          .first();
        if (!warehouseAsset) {
          throw new NotFoundError(
            `Batch code ${batch_code} không tồn tại trong kho ${warehouse_id}`,
          );
        }
        if (warehouseAsset.quantity < quantity) {
          throw new BadRequestError(
            `Số lượng trong kho không đủ cho batch code ${batch_code}`,
          );
        }
        await trx("warehouse_asset")
          .where({ id: warehouseAsset.id })
          .update({
            quantity: warehouseAsset.quantity - quantity,
            modified_by_user_id: created_by_user_id,
            updated_at: trx.raw("NOW()"),
          });
        const resultItem = await trx<AssetTransactionItems>(
          "asset_transaction_items",
        ).insert({
          transaction_id: transactionId,
          warehouse_asset_id: warehouseAsset.id,
          quantity,
          created_by_user_id,
        });
        const itemId = resultItem[0];
        const itemRecord = await trx<AssetTransactionItems>(
          "asset_transaction_items",
        )
          .where("id", itemId)
          .first();
        insertedItems.push(itemRecord);
      }
      return {
        ...transaction,
        allocation_date,
        return_deadline,
        receiver_id,
        items: insertedItems,
      };
    });
  }

  static async processReturn({
    items,
    return_date,
    returned_by_user_id,
    transaction_code,
  }: ProcessReturnDto) {
    return await db.transaction(async (trx) => {
      const transaction = await trx<AssetTransactions>("asset_transactions")
        .where("code", transaction_code)
        .first();

      if (!transaction) {
        throw new NotFoundError(
          `Không tìm thấy transaction với code ${transaction_code}`,
        );
      }

      const lifecycle = await trx("asset_lifecycle")
        .where("transaction_id", transaction.id)
        .first();

      if (!lifecycle) {
        throw new NotFoundError(
          `Không tìm thấy lifecycle cho transaction id ${transaction.id}`,
        );
      }

      if (!lifecycle?.return_deadline) {
        throw new BadRequestError(`Cấp phát này không có hạn trả`);
      }

      const processedItems: any[] = [];

      for (const item of items) {
        const { batch_code, status } = item;

        const warehouseAsset = await trx("warehouse_asset")
          .where({ batch_code })
          .first();

        if (!warehouseAsset) {
          throw new NotFoundError(`Batch code ${batch_code} không tồn tại`);
        }

        const transactionItem = await trx("asset_transaction_items as ati")
          .join("warehouse_asset as wa", "ati.warehouse_asset_id", "wa.id")
          .where("ati.transaction_id", transaction.id)
          .andWhere("wa.batch_code", batch_code)
          .first<{ quantity: number }>("ati.quantity");

        if (!transactionItem) {
          throw new NotFoundError(
            `Không tìm thấy item transaction cho batch_code ${batch_code}`,
          );
        }

        const quantityToReturn = transactionItem.quantity;

        const shouldAppendToOldBatch =
          warehouseAsset.quantity === 0 || warehouseAsset.status === status;

        let warehouseAssetIdToUse = warehouseAsset.id;

        if (shouldAppendToOldBatch) {
          await trx("warehouse_asset")
            .where({ id: warehouseAsset.id })
            .update({
              quantity: warehouseAsset.quantity + quantityToReturn,
              status,
              modified_by_user_id: returned_by_user_id,
              updated_at: trx.raw("NOW()"),
            });
        } else {
          const newBatchCode = generateBatchCode(
            warehouseAsset.asset_id.toString(),
          );
          const [newBatch] = await trx("warehouse_asset").insert(
            {
              warehouse_id: warehouseAsset.warehouse_id,
              asset_id: warehouseAsset.asset_id,
              batch_code: newBatchCode,
              quantity: quantityToReturn,
              status,
              maintenance_due: warehouseAsset.maintenance_due,
              manufacture_date: warehouseAsset.manufacture_date,
              expiration_date: warehouseAsset.expiration_date,
              created_by_user_id: returned_by_user_id,
              updated_at: trx.raw("NOW()"),
            },
            ["id"],
          );

          warehouseAssetIdToUse = newBatch.id;
        }

        await trx("asset_transaction_items")
          .where({
            transaction_id: transaction.id,
            warehouse_asset_id: warehouseAsset.id,
          })
          .update({
            warehouse_asset_id: warehouseAssetIdToUse,
            status: status,
            updated_at: trx.raw("NOW()"),
            modified_by_user_id: returned_by_user_id,
          });

        processedItems.push({
          batch_code,
          warehouse_asset_id: warehouseAssetIdToUse,
          quantity: quantityToReturn,
          status,
        });
      }

      await trx("asset_lifecycle")
        .where("transaction_id", transaction.id)
        .update({
          return_date,
          modified_by_user_id: returned_by_user_id,
          updated_at: trx.raw("NOW()"),
        });

      return {
        transaction_id: transaction.id,
        transaction_code,
        return_date,
        returned_by_user_id,
        items: processedItems,
      };
    });
  }

  static async createDisposal(createDisposalDto: CreateDisposalDto) {
    return await db.transaction(async (trx) => {
      const {
        warehouse_id,
        created_by_user_id,
        name,
        note,
        reason,
        disposal_date,
        items,
        code,
      } = createDisposalDto;
      const trxFound = await trx("asset_transactions")
        .where("code", code)
        .first();
      if (trxFound)
        throw new BadRequestError("mã không hợp lệ, thử với mã khác");
      const resultTrans = await trx("asset_transactions").insert({
        code,
        name,
        reason,
        note,
        type: TransactionTypeEnum.DISPOSAL,
        warehouse_id,
        created_by_user_id,
      });
      const transactionId = resultTrans[0];
      if (!transactionId) throw new Error("Không tạo được transaction");
      const transaction = await trx("asset_transactions")
        .where("id", transactionId)
        .first();
      await trx("asset_lifecycle").insert({
        transaction_id: transactionId,
        disposal_date,
        created_by_user_id,
      });
      const insertedItems: any[] = [];
      for (const item of items) {
        const { batch_code, quantity, cost } = item;
        const warehouseAsset = await trx("warehouse_asset")
          .where({
            warehouse_id,
            batch_code,
          })
          .first();
        if (!warehouseAsset) {
          throw new NotFoundError(
            `Batch code ${batch_code} không tồn tại trong kho ${warehouse_id}`,
          );
        }

        if (warehouseAsset.quantity < quantity) {
          throw new BadRequestError(
            `Số lượng trong kho không đủ cho batch code ${batch_code}`,
          );
        }

        await trx("warehouse_asset")
          .where({ id: warehouseAsset.id })
          .update({
            quantity: warehouseAsset.quantity - quantity,
            modified_by_user_id: created_by_user_id,
            updated_at: trx.raw("NOW()"),
          });

        await trx<AssetTransactionItems>("asset_transaction_items").insert({
          transaction_id: transactionId,
          warehouse_asset_id: warehouseAsset.id,
          quantity,
          cost,
          created_by_user_id,
        });
        insertedItems.push({
          batch_code,
          warehouse_asset_id: warehouseAsset.id,
          quantity,
          cost,
        });
      }
      return { ...transaction, disposal_date, items: insertedItems };
    });
  }
  static groupItems(items: any) {
    const map = new Map();
    for (const item of items) {
      const key = JSON.stringify({
        asset_id: item.asset_id,
        batch_code: item.batch_code || null,
        manufacture_date: item.manufacture_date || null,
        expiration_date: item.expiration_date || null,
        maintenance_due: item.maintenance_due || null,
        cost: item.cost,
      });

      if (!map.has(key)) {
        map.set(key, { ...item });
      } else {
        map.get(key).quantity += item.quantity;
      }
    }

    return Array.from(map.values());
  }
  static async importManual({
    warehouse_id,
    items,
    received_date,
    sender_location,
    note,
    reason,
    created_by_user_id,
    name,
    code,
  }: ImportManualDto) {
    const warehouseFound = await warehouseRepository.findOneByCondition({
      id: warehouse_id,
    });
    if (!warehouseFound) {
      throw new NotFoundError("kho không tồn tại");
    }

    return await db.transaction(async (trx) => {
      const trxFound = await trx("asset_transactions")
        .where("code", code)
        .first();
      if (trxFound)
        throw new BadRequestError("mã không hợp lệ, thử với mã khác");
      const resultTrans = await trx("asset_transactions").insert({
        code,
        name,
        reason,
        note,
        type: TransactionTypeEnum.IMPORT,
        warehouse_id,
        created_by_user_id,
      });

      const transactionId = resultTrans[0];
      if (!transactionId) throw new Error("Không tạo được transaction");

      const transaction = await trx("asset_transactions")
        .where("id", transactionId)
        .first();

      const resultImport = await trx("asset_imports").insert({
        transaction_id: transactionId,
        received_date,
        sender_location,
        created_by_user_id,
      });

      const importId = resultImport[0];

      const importRecord = await trx("asset_imports")
        .where("id", importId)
        .first();

      const insertedItems: any[] = [];
      const groupedItems = this.groupItems(items);
      for (const item of groupedItems) {
        const {
          asset_id,
          quantity,
          batch_code,
          cost,
          manufacture_date,
          expiration_date,
          maintenance_due,
        } = item;

        let warehouseAssetId: number;

        if (batch_code) {
          const existingWA = await trx("warehouse_asset")
            .where({
              warehouse_id,
              asset_id,
              batch_code,
            })
            .first();

          if (!existingWA) {
            throw new NotFoundError(
              `Batch code ${batch_code} không tồn tại trong kho ${warehouse_id} cho asset ${asset_id}`,
            );
          }

          await trx("warehouse_asset")
            .where({ id: existingWA.id })
            .update({
              quantity: existingWA.quantity + quantity,
              modified_by_user_id: created_by_user_id,
              updated_at: trx.raw("NOW()"),
            });

          warehouseAssetId = existingWA.id;
        } else {
          const newBatchCode = generateBatchCode(asset_id.toString());
          const resultWA = await trx("warehouse_asset").insert({
            warehouse_id,
            asset_id,
            batch_code: newBatchCode,
            quantity,
            status: AssetStatusEnum.GOOD,
            maintenance_due: normalizeDate(maintenance_due),
            manufacture_date: normalizeDate(manufacture_date),
            expiration_date: normalizeDate(expiration_date),
            created_by_user_id,
          });

          warehouseAssetId = resultWA[0];
        }

        const resultItem = await trx("asset_transaction_items").insert({
          transaction_id: transactionId,
          warehouse_asset_id: warehouseAssetId,
          quantity,
          cost,
          created_by_user_id,
        });

        const itemId = resultItem[0];

        const itemRecord = await trx("asset_transaction_items")
          .where("id", itemId)
          .first();

        insertedItems.push(itemRecord);
      }

      return {
        ...transaction,
        received_date: importRecord.received_date,
        sender_location: importRecord.sender_location,
        items: insertedItems,
      };
    });
  }
  static async importFromExcel({
    file,
    warehouse_id,
    created_by_user_id,
    name,
    note,
    reason,
    received_date,
    sender_location,
    code,
  }: ImportExcelDto) {
    const validationExcel = await this.validateTransactionImportExcel(
      warehouse_id,
      file,
    );
    if (validationExcel.length != 0 || !file)
      throw new BadRequestError("Vui lòng kiểm tra lại dữ liệu");

    const asset_items = parseUploadedFileColumns<AssetImportRow>(file, [
      "Mã tài sản",
      "Số lượng",
      "Giá trị",
      "Hạn bảo trì",
      "Hạn sử dụng",
      "Ngày sản xuất",
      "Mã lô",
    ]);
    return await db.transaction(async (trx) => {
      const trxFound = await trx("asset_transactions")
        .where("code", code)
        .first();
      if (trxFound)
        throw new BadRequestError("mã không hợp lệ, thử với mã khác");
      const resultTrans = await trx("asset_transactions").insert({
        code,
        name,
        reason,
        note,
        type: TransactionTypeEnum.IMPORT,
        warehouse_id,
        created_by_user_id,
      });

      const transactionId = resultTrans[0];
      if (!transactionId) throw new Error("Không tạo được transaction");

      const transaction = await trx("asset_transactions")
        .where("id", transactionId)
        .first();

      const resultImport = await trx("asset_imports").insert({
        transaction_id: transactionId,
        received_date,
        sender_location,
        created_by_user_id,
      });

      const importId = resultImport[0];

      const importRecord = await trx("asset_imports")
        .where("id", importId)
        .first();

      const insertedItems: any[] = [];
      const assetMap = await assetRepository.getAssetIdsByCodes(
        asset_items.map((item) => item["Mã tài sản"]),
      );
      for (const item of asset_items) {
        const {
          "Giá trị": cost,
          "Số lượng": quantity,
          "Mã lô": batch_code,
          "Ngày sản xuất": manufacture_date,
          "Hạn sử dụng": expiration_date,
          "Hạn bảo trì": maintenance_due,
          "Mã tài sản": asset_code,
        } = item;
        const asset_id = assetMap.get(asset_code);
        if (!asset_id) {
          throw new NotFoundError(
            `Không tìm thấy tài sản với mã ${asset_code}`,
          );
        }
        let warehouseAssetId: number;

        if (batch_code) {
          const existingWA = await trx("warehouse_asset")
            .where({
              warehouse_id,
              asset_id,
              batch_code,
            })
            .first();

          if (!existingWA) {
            throw new NotFoundError(
              `Batch code ${batch_code} không tồn tại trong kho`,
            );
          }

          await trx("warehouse_asset")
            .where({ id: existingWA.id })
            .update({
              quantity: existingWA.quantity + quantity,
              modified_by_user_id: created_by_user_id,
              updated_at: trx.raw("NOW()"),
            });

          warehouseAssetId = existingWA.id;
        } else {
          const newBatchCode = generateBatchCode(asset_id.toString());
          const resultWA = await trx("warehouse_asset").insert({
            warehouse_id,
            asset_id,
            batch_code: newBatchCode,
            quantity,
            status: AssetStatusEnum.GOOD,
            maintenance_due: excelToJsDate(maintenance_due),
            manufacture_date: excelToJsDate(manufacture_date),
            expiration_date: excelToJsDate(expiration_date),
            created_by_user_id,
          });

          warehouseAssetId = resultWA[0];
        }

        const resultItem = await trx("asset_transaction_items").insert({
          transaction_id: transactionId,
          warehouse_asset_id: warehouseAssetId,
          quantity,
          cost,
          created_by_user_id,
        });

        const itemId = resultItem[0];

        const itemRecord = await trx("asset_transaction_items")
          .where("id", itemId)
          .first();

        insertedItems.push(itemRecord);
      }

      return {
        ...transaction,
        received_date: importRecord.received_date,
        sender_location: importRecord.sender_location,
        items: insertedItems,
      };
    });
  }
  static async exportManual({
    created_by_user_id,
    export_date,
    items,
    name,
    receiver_address,
    receiver_name,
    receiver_phone,
    warehouse_id,
    note,
    reason,
    code,
  }: ExportManualDto) {
    const warehouseFound = await warehouseRepository.findOneByCondition({
      id: warehouse_id,
    });
    if (!warehouseFound) {
      throw new NotFoundError("kho không tồn tại");
    }

    return await db.transaction(async (trx) => {
      const trxFound = await trx("asset_transactions")
        .where("code", code)
        .first();
      if (trxFound)
        throw new BadRequestError("mã không hợp lệ, thử với mã khác");
      const resultTrans = await trx("asset_transactions").insert({
        code,
        name,
        reason,
        note,
        type: TransactionTypeEnum.EXPORT,
        warehouse_id,
        created_by_user_id,
      });
      const transactionId = resultTrans[0];
      if (!transactionId)
        throw new InternalServerError("Không tạo được transaction");
      const transaction = await trx("asset_transactions")
        .where("id", transactionId)
        .first();
      const resultExport = await trx("asset_exports").insert({
        transaction_id: transactionId,
        export_date,
        receiver_name,
        receiver_phone,
        receiver_address,
        created_by_user_id,
      });
      const exportId = resultExport[0];
      const exportRecord = await trx("asset_exports")
        .where("id", exportId)
        .first();
      const insertedItems: any[] = [];
      for (const item of items) {
        const { batch_code, quantity } = item;
        const warehouseAsset = await trx("warehouse_asset")
          .where({
            warehouse_id,
            batch_code,
          })
          .first();
        if (!warehouseAsset) {
          throw new NotFoundError(
            `Batch code ${batch_code} không tồn tại trong kho ${warehouse_id}`,
          );
        }
        if (warehouseAsset.quantity < quantity) {
          throw new BadRequestError(
            `Số lượng trong kho không đủ cho batch code ${batch_code}`,
          );
        }
        await trx("warehouse_asset")
          .where({ id: warehouseAsset.id })
          .update({
            quantity: warehouseAsset.quantity - quantity,
            modified_by_user_id: created_by_user_id,
            updated_at: trx.raw("NOW()"),
          });
        const resultItem = await trx<AssetTransactionItems>(
          "asset_transaction_items",
        ).insert({
          transaction_id: transactionId,
          warehouse_asset_id: warehouseAsset.id,
          quantity,
          created_by_user_id,
        });
        const itemId = resultItem[0];
        const itemRecord = await trx<AssetTransactionItems>(
          "asset_transaction_items",
        )
          .where("id", itemId)
          .first();
        insertedItems.push(itemRecord);
      }
      return {
        ...transaction,
        export_date: exportRecord.export_date,
        receiver_name: exportRecord.receiver_name,
        receiver_phone: exportRecord.receiver_phone,
        receiver_address: exportRecord.receiver_address,
        items: insertedItems,
      };
    });
  }
  static async exportFromExcel({
    created_by_user_id,
    file,
    warehouse_id,
    name,
    note,
    reason,
    export_date,
    receiver_address,
    receiver_name,
    receiver_phone,
    code,
  }: ExportExcelDto) {
    const validateionExcel = await this.validateTransactionExportExcel(
      warehouse_id,
      file,
    );
    if (validateionExcel.length != 0 || !file)
      throw new BadRequestError("Vui lòng kiểm tra lại dữ liệu");

    const asset_items = parseUploadedFileColumns<AssetExportRow>(file, [
      "Mã lô",
      "Số lượng",
    ]);
    return await db.transaction(async (trx) => {
      const trxFound = await trx("asset_transactions")
        .where("code", code)
        .first();
      if (trxFound)
        throw new BadRequestError("mã không hợp lệ, thử với mã khác");
      const resultTrans = await trx("asset_transactions").insert({
        code,
        name,
        reason,
        note,
        type: TransactionTypeEnum.EXPORT,
        warehouse_id,
        created_by_user_id,
      });
      const transactionId = resultTrans[0];
      if (!transactionId)
        throw new InternalServerError("Không tạo được transaction");
      const transaction = await trx("asset_transactions")
        .where("id", transactionId)
        .first();

      const resultExport = await trx("asset_exports").insert({
        transaction_id: transactionId,
        export_date,
        created_by_user_id,
        receiver_name,
        receiver_phone,
        receiver_address,
      });
      const exportId = resultExport[0];
      const exportRecord = await trx("asset_exports")
        .where("id", exportId)
        .first();
      const insertedItems: any[] = [];
      for (const item of asset_items) {
        const { "Mã lô": batch_code, "Số lượng": quantity } = item;
        const warehouseAsset = await trx("warehouse_asset")
          .where({
            warehouse_id,
            batch_code,
          })
          .first();
        if (!warehouseAsset) {
          throw new NotFoundError(
            `Batch code ${batch_code} không tồn tại trong kho ${warehouse_id}`,
          );
        }
        if (warehouseAsset.quantity < quantity) {
          throw new BadRequestError(
            `Số lượng trong kho không đủ cho batch code ${batch_code}`,
          );
        }
        await trx("warehouse_asset")
          .where({ id: warehouseAsset.id })
          .update({
            quantity: warehouseAsset.quantity - quantity,
            modified_by_user_id: created_by_user_id,
            updated_at: trx.raw("NOW()"),
          });
        const resultItem = await trx<AssetTransactionItems>(
          "asset_transaction_items",
        ).insert({
          transaction_id: transactionId,
          warehouse_asset_id: warehouseAsset.id,
          quantity,
          created_by_user_id,
        });
        const itemId = resultItem[0];
        const itemRecord = await trx<AssetTransactionItems>(
          "asset_transaction_items",
        )
          .where("id", itemId)
          .first();
        insertedItems.push(itemRecord);
      }
      return {
        ...transaction,
        export_date: exportRecord.export_date,
        items: insertedItems,
      };
    });
  }
  static async validateTransactionImportExcel(
    warehouse_id: number,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestError("Chưa tải lên file");
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
      throw new BadRequestError("File Excel không hợp lệ hoặc trống");
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (rows.length === 0) {
      throw new BadRequestError("File Excel không có dữ liệu");
    }

    const errors: Array<{ index: number; reasons: string[] }> = [];

    const assetCodesSet = new Set<string>();
    const batchCodesSet = new Set<string>();
    rows.forEach((row: any) => {
      if (row["Mã tài sản"]) assetCodesSet.add(row["Mã tài sản"]);
      if (row["Mã lô"]) batchCodesSet.add(row["Mã lô"]);
    });

    const assetCodes = [...assetCodesSet];
    const batchCodes = [...batchCodesSet];
    const [existedAssetCodes, existedBatchCodes] = await Promise.all([
      assetRepository.findExistedCodes(assetCodes),
      warehouseAssetRepository.findExistedBatchCodesInWH(
        batchCodes,
        warehouse_id,
      ),
    ]);

    const assetCodeSet = new Set(existedAssetCodes);
    const batchCodeSet = new Set(existedBatchCodes);

    rows.forEach((row: any, idx: number) => {
      const line = idx + 1;
      const reasons: string[] = [];

      const batchCode = row["Mã lô"]?.trim();
      const assetCode = row["Mã tài sản"]?.trim();
      const name = row["Tên"];
      const quantity = row["Số lượng"];
      const cost = row["Giá trị"];
      const manufacturedAt = row["Ngày sản xuất"];
      const maintenanceDue = row["Hạn bảo trì"];
      const expirationDate = row["Hạn sử dụng"];

      // Validate Mã lô
      if (batchCode) {
        if (!batchCodeSet.has(batchCode)) {
          reasons.push(`Mã lô '${batchCode}' không tồn tại trong kho`);
        }
      }

      // Validate Mã tài sản
      if (!assetCodeSet.has(assetCode)) {
        reasons.push(`Mã tài sản '${assetCode}' không tồn tại`);
      }

      // Validate Tên
      if (!name || typeof name !== "string") {
        reasons.push("Tên tài sản không hợp lệ");
      }

      // Validate số lượng
      if (typeof quantity !== "number" || quantity <= 0) {
        reasons.push("Số lượng không hợp lệ");
      }

      // Validate giá trị
      if (typeof cost !== "number" || cost <= 0) {
        reasons.push("Giá trị không hợp lệ");
      }

      if (!manufacturedAt) {
        reasons.push("Ngày sản xuất không hợp lệ");
      }

      // Validate hạn bảo trì
      if (!maintenanceDue) {
        reasons.push("Hạn bảo trì không hợp lệ");
      }

      // Validate hạn sử dụng
      if (!expirationDate) {
        reasons.push("Hạn sử dụng không hợp lệ");
      }

      if (reasons.length > 0) {
        errors.push({ index: line, reasons });
      }
    });

    return errors;
  }
  static async validateTransactionExportExcel(
    warehouse_id: number,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestError("Chưa tải lên file");
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!sheet) {
      throw new BadRequestError("File Excel không hợp lệ hoặc trống");
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (rows.length === 0) {
      throw new BadRequestError("File Excel không có dữ liệu");
    }

    const errors: Array<{ index: number; reasons: string[] }> = [];

    const batchCodesSet = new Set<string>();
    rows.forEach((row: any) => {
      if (row["Mã lô"]) batchCodesSet.add(row["Mã lô"]);
    });
    const batchCodes = [...batchCodesSet];
    const existedBatchCodes =
      await warehouseAssetRepository.findExistedBatchCodesInWH(
        batchCodes,
        warehouse_id,
      );
    const batchCodeSet = new Set(existedBatchCodes);
    rows.forEach((row: any, idx: number) => {
      const line = idx + 1;
      const reasons: string[] = [];
      const batchCode = row["Mã lô"];
      const quantity = row["Số lượng"];
      if (!batchCodeSet.has(batchCode)) {
        reasons.push(`Mã lô '${batchCode}' không tồn tại trong kho`);
      }

      if (typeof quantity !== "number" || quantity <= 0) {
        reasons.push("Số lượng không hợp lệ");
      }

      if (reasons.length > 0) {
        errors.push({ index: line, reasons });
      }
    });

    return errors;
  }
  static async createMaintenance({
    created_by_user_id,
    items,
    maintenance_date,
    name,
    warehouse_id,
    note,
    reason,
    code,
  }: CreateMaintenanceDto) {
    return await db.transaction(async (trx) => {
      const trxFound = await trx("asset_transactions")
        .where("code", code)
        .first();
      if (trxFound)
        throw new BadRequestError("mã không hợp lệ, thử với mã khác");
      const [transactionId] = await trx(ASSET_TRANSACTIONS_TABLE_NAME).insert({
        code,
        name,
        reason,
        note,
        type: TransactionTypeEnum.MAINTENANCE,
        warehouse_id,
        created_by_user_id,
      });

      if (!transactionId) {
        throw new InternalServerError("Không tạo được transaction");
      }

      const transaction = await trx(ASSET_TRANSACTIONS_TABLE_NAME)
        .where("id", transactionId)
        .first();

      await trx(ASSET_MAINTENANCES_TABLE_NAME).insert({
        transaction_id: transactionId,
        maintenance_date: maintenance_date,
        created_by_user_id,
        status: MaintenanceStatusEnum.IN_PROGRESS,
      });

      const insertedItems = [];

      for (const item of items) {
        const { batch_code, quantity, cost } = item;

        const batch = await trx(WAREHOUSE_ASSET_TABLE_NAME)
          .where({
            warehouse_id,
            batch_code,
          })
          .first();

        if (!batch) {
          throw new NotFoundError(
            `Batch ${batch_code} không tồn tại trong kho ${warehouse_id}`,
          );
        }

        if (batch.quantity < quantity) {
          throw new BadRequestError(`Số lượng batch ${batch_code} không đủ`);
        }

        await trx(WAREHOUSE_ASSET_TABLE_NAME)
          .where("id", batch.id)
          .update({
            quantity: batch.quantity - quantity,
            modified_by_user_id: created_by_user_id,
            updated_at: trx.fn.now(),
          });

        const [itemId] = await trx<AssetTransactionItems>(
          ASSET_TRANSACTION_ITEMS_TABLE_NAME,
        ).insert({
          transaction_id: transactionId,
          warehouse_asset_id: batch.id,
          quantity,
          cost: cost ?? 0,
          created_by_user_id,
        });

        const itemRecord = await trx(ASSET_TRANSACTION_ITEMS_TABLE_NAME)
          .where("id", itemId)
          .first();

        insertedItems.push(itemRecord);

        await trx(WAREHOUSE_ASSET_TABLE_NAME).where("id", batch.id).update({
          status: AssetStatusEnum.MAINTENANCE,
          modified_by_user_id: created_by_user_id,
          updated_at: trx.fn.now(),
        });
      }

      return {
        ...transaction,
        maintenance_date,
        items: insertedItems,
      };
    });
  }
  static async updateMaintenance({
    items,
    modified_by_user_id,
    transaction_code,
    completion_date,
  }: UpdateMaintenanceDto) {
    return await db.transaction(async (trx) => {
      const transaction = await trx<AssetTransactions>(
        ASSET_TRANSACTIONS_TABLE_NAME,
      )
        .where("code", transaction_code)
        .first();

      if (!transaction) {
        throw new NotFoundError(
          `Không tìm thấy transaction với code ${transaction_code}`,
        );
      }

      const maintenance = await trx(ASSET_MAINTENANCES_TABLE_NAME)
        .where("transaction_id", transaction.id)
        .first();

      if (!maintenance) {
        throw new NotFoundError(`Không tìm thấy giao dịch bảo trì này`);
      }

      const processedItems: any[] = [];

      for (const item of items) {
        const { batch_code, status, next_maintenance_date } = item;

        const nextDate = new Date(next_maintenance_date);
        if (isNaN(nextDate.getTime())) {
          throw new BadRequestError(
            `Next maintenance date for batch ${batch_code} is invalid`,
          );
        }
        if (nextDate < new Date()) {
          throw new BadRequestError(
            `Next maintenance date for batch ${batch_code} cannot be in the past`,
          );
        }

        const warehouseAsset = await trx(WAREHOUSE_ASSET_TABLE_NAME)
          .where({ batch_code })
          .first();

        if (!warehouseAsset) {
          throw new NotFoundError(`Batch code ${batch_code} không tồn tại`);
        }

        const oldData = {
          status: warehouseAsset.status,
          maintenance_due: warehouseAsset.maintenance_due,
          quantity: warehouseAsset.quantity,
          batch_code: warehouseAsset.batch_code,
        };

        const transactionItem = await trx("asset_transaction_items as ati")
          .join("warehouse_asset as wa", "ati.warehouse_asset_id", "wa.id")
          .where("ati.transaction_id", transaction.id)
          .andWhere("wa.batch_code", batch_code)
          .first<{ quantity: number }>("ati.quantity");

        if (!transactionItem) {
          throw new NotFoundError(
            `Không tìm thấy item transaction cho batch_code ${batch_code}`,
          );
        }

        const quantityToReturn = transactionItem.quantity;

        const shouldAppendToOldBatch =
          warehouseAsset.quantity === 0 || warehouseAsset.status === status;

        let warehouseAssetIdToUse = warehouseAsset.id;

        if (shouldAppendToOldBatch) {
          await trx(WAREHOUSE_ASSET_TABLE_NAME)
            .where({ id: warehouseAsset.id })
            .update({
              quantity: warehouseAsset.quantity + quantityToReturn,
              status,
              modified_by_user_id,
              updated_at: trx.raw("NOW()"),
              maintenance_due:
                next_maintenance_date ?? warehouseAsset.maintenance_due,
            });
        } else {
          const newBatchCode = generateBatchCode(
            warehouseAsset.asset_id.toString(),
          );
          const [newBatch] = await trx(WAREHOUSE_ASSET_TABLE_NAME).insert(
            {
              warehouse_id: warehouseAsset.warehouse_id,
              asset_id: warehouseAsset.asset_id,
              batch_code: newBatchCode,
              quantity: quantityToReturn,
              status,
              maintenance_due:
                next_maintenance_date ?? warehouseAsset.maintenance_due,
              manufacture_date: warehouseAsset.manufacture_date,
              expiration_date: warehouseAsset.expiration_date,
              created_by_user_id: modified_by_user_id,
              updated_at: trx.raw("NOW()"),
            },
            ["id"],
          );
          warehouseAssetIdToUse = newBatch.id;
        }

        await trx(ASSET_TRANSACTION_ITEMS_TABLE_NAME)
          .where({
            transaction_id: transaction.id,
            warehouse_asset_id: warehouseAsset.id,
          })
          .update({
            warehouse_asset_id: warehouseAssetIdToUse,
            status: status,
            updated_at: trx.raw("NOW()"),
            modified_by_user_id,
          });

        processedItems.push({
          batch_code,
          warehouse_asset_id: warehouseAssetIdToUse,
          quantity: quantityToReturn,
          status,
        });
      }

      await trx<AssetMaintenances>(ASSET_MAINTENANCES_TABLE_NAME)
        .where("transaction_id", transaction.id)
        .update({
          modified_by_user_id,
          updated_at: trx.raw("NOW()"),
          status: MaintenanceStatusEnum.COMPLETED,
        });

      return {
        transaction_id: transaction.id,
        transaction_code,
        items: processedItems,
      };
    });
  }
  static async getTransactionDetail(code: string) {
    if (!code) throw new BadRequestError("code không hợp lệ");
    const foundTransaction =
      await assetTransactionsRepository.findOneByCondition({
        code,
      });

    if (!foundTransaction) {
      throw new NotFoundError("mã không tồn tại");
    }

    switch (foundTransaction.type) {
      case TransactionTypeEnum.IMPORT:
        return await assetTransactionsRepository.findTransactionImportById(
          foundTransaction.id,
        );
      case TransactionTypeEnum.EXPORT:
        return await assetTransactionsRepository.findTransactionExportById(
          foundTransaction.id,
        );
      case TransactionTypeEnum.DISPOSAL:
        return await assetTransactionsRepository.findTransactionLifecycleById(
          foundTransaction.id,
        );
      case TransactionTypeEnum.ALLOCATION_RETURN:
        return await assetTransactionsRepository.findTransactionLifecycleById(
          foundTransaction.id,
        );
      case TransactionTypeEnum.MAINTENANCE:
        return await assetTransactionsRepository.findTransactionMaintenanceById(
          foundTransaction.id,
        );
      default:
        throw new BadRequestError("type không hợp lệ");
    }
  }
  static async getTransactions(
    {
      page,
      size,
      types,
      code,
      created_by_user_id,
      from_date,
      to_date,
      asset_code,
    }: PaginationTransactionsDto,
    warehouse_id: number,
  ) {
    return await assetTransactionsRepository.findAllCustom({
      types,
      page,
      size,
      code,
      created_by_user_id,
      from_date,
      to_date,
      warehouse_id,
    });
  }
  static async getTransactionsForAsset({
    page,
    size,
    types,
    asset_code,
    warehouse_id,
  }: PaginationTransactionsForAssetDto): Promise<ResponsePaginationDto<any>> {
    const assetFound = await assetRepository.findOneByCondition({
      code: asset_code,
    });
    if (!assetFound) throw new NotFoundError("mã tài sản không tồn tại");
    return await assetTransactionsRepository.findAllTransactionsByAsset({
      asset_id: assetFound.id,
      page,
      size,
      types,
      warehouse_id,
    });
  }
  static async getStatsImportExportWHOwn(
    warehouse_id: number,
  ): Promise<TrendData[]> {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const rows = await db<AssetTransactions>("asset_transactions")
      .select(
        db.raw("DATE_FORMAT(created_at, '%m/%Y') as month"),
        "type",
        db.raw("COUNT(*) as count"),
      )
      .whereIn("type", [TransactionTypeEnum.IMPORT, TransactionTypeEnum.EXPORT])
      .where("warehouse_id", warehouse_id)
      .andWhere("created_at", ">=", startDate)
      .groupBy("month", "type")
      .orderBy("month", "asc");

    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      months.push(m);
    }

    const map: Record<string, TrendData> = {
      Nhập: { id: "Nhập", data: months.map((m) => ({ x: m, y: 0 })) },
      Xuất: { id: "Xuất", data: months.map((m) => ({ x: m, y: 0 })) },
    };

    rows.forEach((row: any) => {
      const label = row.type === TransactionTypeEnum.IMPORT ? "Nhập" : "Xuất";
      const index = map[label].data.findIndex((d) => d.x === row.month);
      if (index !== -1) {
        map[label].data[index].y = Number(row.count);
      }
    });

    return [map["Nhập"], map["Xuất"]];
  }
}
export default TransactionService;
