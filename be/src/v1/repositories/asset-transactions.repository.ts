import {
  ASSET_LIFECYCLE_TABLE_NAME,
  ASSET_TABLE_NAME,
  ASSET_TRANSACTION_ITEMS_TABLE_NAME,
  ASSET_TRANSACTIONS_TABLE_NAME,
  WAREHOUSE_ASSET_TABLE_NAME,
} from "../cores/constants/table-name.constant";
import BaseRepository from "./base.repository";
import { AssetTransactions } from "../models/asset-transactions.model";
import db from "../databases/init.mysql-v2";
import ResponseTransactionsDto from "../dtos/transaction/response-transaction.dto";
import ResponseTransactionItemDto from "../dtos/transaction/response-transaction-item.dto";
import TransactionTypeEnum from "../cores/enums/transaction-type.enum";
import { ResponsePaginationDto } from "../cores/dtos/response-pagination.dto";

class AssetTransactionsRepository extends BaseRepository<AssetTransactions> {
  constructor() {
    super(ASSET_TRANSACTIONS_TABLE_NAME);
  }

  async findAllCustom({
    types,
    page,
    size,
    code,
    created_by_user_id,
    from_date,
    to_date,
    warehouse_id,
    asset_code,
  }: {
    types: number[];
    page: number;
    size: number;
    code?: string;
    created_by_user_id?: number;
    from_date?: string;
    to_date?: string;
    warehouse_id?: number;
    asset_code?: string;
  }): Promise<ResponsePaginationDto<ResponseTransactionsDto>> {
    const offset = (page - 1) * size;

    let countQuery = db(this.tableName).whereIn("type", types);
    if (warehouse_id)
      countQuery = countQuery.andWhere("warehouse_id", warehouse_id);
    if (code) countQuery = countQuery.andWhere("code", "like", `%${code}%`);
    if (created_by_user_id)
      countQuery = countQuery.andWhere(
        "created_by_user_id",
        created_by_user_id,
      );
    if (from_date)
      countQuery = countQuery.andWhere("created_at", ">=", from_date);
    if (to_date) countQuery = countQuery.andWhere("created_at", "<=", to_date);

    const totalResult = await countQuery
      .count<{ count: string }>("id as count")
      .first();
    const total = totalResult ? parseInt(totalResult.count, 10) : 0;
    const totalPages = Math.ceil(total / size);

    if (total === 0) return { items: [], page, size, total, totalPages };

    let txnQuery = db(`${this.tableName} as t`)
      .select(
        "t.*",
        "u.fullname as created_by_user",
        "u_mdf.fullname as modified_by_user",
        "am.status as maintenance_status",
      )
      .leftJoin("users as u", "t.created_by_user_id", "u.id")
      .leftJoin("users as u_mdf", "t.modified_by_user_id", "u_mdf.id")
      .leftJoin("asset_maintenances as am", function () {
        this.on("am.transaction_id", "=", "t.id").andOn(
          "t.type",
          "=",
          db.raw(TransactionTypeEnum.MAINTENANCE),
        );
      })
      .whereIn("t.type", types)
      .limit(size)
      .offset(offset)
      .orderBy("t.id", "desc");

    if (warehouse_id)
      txnQuery = txnQuery.andWhere("t.warehouse_id", warehouse_id);
    if (code) txnQuery = txnQuery.andWhere("t.code", "like", `%${code}%`);
    if (created_by_user_id)
      txnQuery = txnQuery.andWhere("t.created_by_user_id", created_by_user_id);
    if (from_date)
      txnQuery = txnQuery.andWhere("t.created_at", ">=", from_date);
    if (to_date) txnQuery = txnQuery.andWhere("t.created_at", "<=", to_date);

    const transactions = await txnQuery;
    if (!transactions.length)
      return { items: [], page, size, total, totalPages };

    const transactionIds = transactions.map((txn) => txn.id);

    // const itemsRows: (ResponseTransactionItemDto & {
    //   transaction_id: number;
    // })[] = await db(`${ASSET_TRANSACTION_ITEMS_TABLE_NAME} as ati`)
    //   .select(
    //     "ati.transaction_id",
    //     "ati.warehouse_asset_id",
    //     "ati.quantity",
    //     "ati.cost",
    //     "a.name as asset_name",
    //     "a.code as asset_code",
    //   )
    //   .leftJoin(
    //     `${WAREHOUSE_ASSET_TABLE_NAME} as wa`,
    //     "ati.warehouse_asset_id",
    //     "wa.id",
    //   )
    //   .leftJoin(`${ASSET_TABLE_NAME} as a`, "wa.asset_id", "a.id")
    //   .whereIn("ati.transaction_id", transactionIds);
    let itemsQuery = db(`${ASSET_TRANSACTION_ITEMS_TABLE_NAME} as ati`)
      .select(
        "ati.transaction_id",
        "ati.warehouse_asset_id",
        "ati.quantity",
        "ati.cost",
        "a.name as asset_name",
        "a.code as asset_code",
      )
      .leftJoin(
        `${WAREHOUSE_ASSET_TABLE_NAME} as wa`,
        "ati.warehouse_asset_id",
        "wa.id",
      )
      .leftJoin(`${ASSET_TABLE_NAME} as a`, "wa.asset_id", "a.id")
      .whereIn("ati.transaction_id", transactionIds);

    if (asset_code) {
      itemsQuery = itemsQuery.andWhere("a.code", "like", `%${asset_code}%`);
    }

    const itemsRows: (ResponseTransactionItemDto & {
      transaction_id: number;
    })[] = await itemsQuery;
    const allocationIds = transactions
      .filter((txn) =>
        [
          TransactionTypeEnum.ALLOCATION_RETURN,
          TransactionTypeEnum.DISPOSAL,
        ].includes(txn.type),
      )
      .map((txn) => txn.id);

    const lifecycles =
      allocationIds.length > 0
        ? await db(ASSET_LIFECYCLE_TABLE_NAME)
            .select(
              "transaction_id",
              "allocation_date",
              "return_deadline",
              "return_date",
              "disposal_date",
            )
            .whereIn("transaction_id", allocationIds)
        : [];

    const lifecycleMap = new Map<
      number,
      {
        allocation_date?: Date;
        return_deadline?: Date;
        return_date?: Date;
        disposal_date?: Date;
      }
    >();
    lifecycles.forEach((lf) => {
      lifecycleMap.set(lf.transaction_id, {
        allocation_date: lf.allocation_date,
        return_deadline: lf.return_deadline,
        return_date: lf.return_date,
        disposal_date: lf.disposal_date,
      });
    });

    const itemsMap = new Map<number, ResponseTransactionItemDto[]>();
    for (const item of itemsRows) {
      if (!itemsMap.has(item.transaction_id))
        itemsMap.set(item.transaction_id, []);
      itemsMap.get(item.transaction_id)!.push({
        asset_name: item.asset_name,
        warehouse_asset_id: item.warehouse_asset_id,
        quantity: item.quantity,
        asset_code: item.asset_code,
        cost: item.cost,
      });
    }

    const items = transactions.map((txn) => ({
      ...txn,
      asset_transaction_items: itemsMap.get(txn.id) || [],
      allocation_date:
        TransactionTypeEnum.ALLOCATION_RETURN === txn.type
          ? lifecycleMap.get(txn.id)?.allocation_date
          : undefined,
      return_deadline:
        TransactionTypeEnum.ALLOCATION_RETURN === txn.type
          ? lifecycleMap.get(txn.id)?.return_deadline
          : undefined,
      return_date:
        TransactionTypeEnum.ALLOCATION_RETURN === txn.type
          ? lifecycleMap.get(txn.id)?.return_date
          : undefined,
      disposal_date:
        txn.type === TransactionTypeEnum.DISPOSAL
          ? lifecycleMap.get(txn.id)?.disposal_date
          : undefined,
      maintenance_status:
        txn.type === TransactionTypeEnum.MAINTENANCE
          ? txn.maintenance_status
          : undefined,
    }));

    return { items, page, size, total, totalPages };
  }

  async findTransactionImportById(id: number) {
    const txn = await db(`${this.tableName} as t`)
      .select("t.*", "imp.received_date", "imp.sender_location")
      .leftJoin("asset_imports as imp", "t.id", "imp.transaction_id")
      .where("t.id", id)
      .first();

    if (!txn) return null;

    const items = await db(`${ASSET_TRANSACTION_ITEMS_TABLE_NAME} as ati`)
      .select(
        "ati.warehouse_asset_id",
        "ati.quantity",
        "ati.cost",
        "a.name as asset_name",
        "a.code as asset_code",
      )
      .leftJoin(
        `${WAREHOUSE_ASSET_TABLE_NAME} as wa`,
        "ati.warehouse_asset_id",
        "wa.id",
      )
      .leftJoin(`${ASSET_TABLE_NAME} as a`, "wa.asset_id", "a.id")
      .where("ati.transaction_id", id);

    return {
      ...txn,
      asset_transaction_items: items,
    };
  }

  async findTransactionExportById(id: number) {
    const txn = await db(`${this.tableName} as t`)
      .select(
        "t.*",
        "exp.receiver_name",
        "exp.receiver_phone",
        "exp.receiver_address",
        "exp.export_date",
      )
      .leftJoin("asset_exports as exp", "t.id", "exp.transaction_id")
      .where("t.id", id)
      .first();

    if (!txn) return null;

    const items = await db(`${ASSET_TRANSACTION_ITEMS_TABLE_NAME} as ati`)
      .select(
        "ati.warehouse_asset_id",
        "ati.quantity",
        "ati.cost",
        "a.name as asset_name",
        "a.code as asset_code",
      )
      .leftJoin(
        `${WAREHOUSE_ASSET_TABLE_NAME} as wa`,
        "ati.warehouse_asset_id",
        "wa.id",
      )
      .leftJoin(`${ASSET_TABLE_NAME} as a`, "wa.asset_id", "a.id")
      .where("ati.transaction_id", id);

    return {
      ...txn,
      asset_transaction_items: items,
    };
  }

  async findTransactionLifecycleById(id: number) {
  const txn = await db(`${this.tableName} as t`)
    .select(
      "t.*",
      "lfc.allocation_date",
      "lfc.return_deadline",
      "lfc.return_date",
      "lfc.disposal_date",
      "u_receiver.fullname as u_fullname",
      "u_receiver.email as u_email",
    )
    .leftJoin("asset_lifecycle as lfc", "t.id", "lfc.transaction_id")
    .leftJoin("users as u_receiver", "lfc.receiver_id", "u_receiver.id")
    .where("t.id", id)
    .first();

  if (!txn) return null;

  const items = await db(`${ASSET_TRANSACTION_ITEMS_TABLE_NAME} as ati`)
    .select(
      "ati.warehouse_asset_id",
      "ati.quantity",
      "ati.cost",
      "ati.status",
      "a.name as asset_name",
      "a.code as asset_code",
      "wa.batch_code",
    )
    .leftJoin(
      `${WAREHOUSE_ASSET_TABLE_NAME} as wa`,
      "ati.warehouse_asset_id",
      "wa.id",
    )
    .leftJoin(`${ASSET_TABLE_NAME} as a`, "wa.asset_id", "a.id")
    .where("ati.transaction_id", id);

  return {
    ...txn,
    asset_transaction_items: items,
  };
}


  async findTransactionMaintenanceById(id: number) {
    const txn = await db(`${this.tableName} as t`)
      .select("t.*", "am.maintenance_date", "am.status as maintenance_status")
      .leftJoin("asset_maintenances as am", "am.transaction_id", "t.id")
      .where("t.id", id)
      .andWhere("t.type", TransactionTypeEnum.MAINTENANCE)
      .first();

    if (!txn) return null;

    const items = await db(`${ASSET_TRANSACTION_ITEMS_TABLE_NAME} as ati`)
      .select(
        "ati.warehouse_asset_id",
        "ati.quantity",
        "ati.cost",
        "ati.status",
        "a.name as asset_name",
        "a.code as asset_code",
        "wa.batch_code",
      )
      .leftJoin(
        `${WAREHOUSE_ASSET_TABLE_NAME} as wa`,
        "ati.warehouse_asset_id",
        "wa.id",
      )
      .leftJoin(`${ASSET_TABLE_NAME} as a`, "wa.asset_id", "a.id")
      .where("ati.transaction_id", id);

    return {
      ...txn,
      asset_transaction_items: items,
    };
  }

  async findAllTransactionsByAsset({
    asset_id,
    page,
    size,
    types,
    warehouse_id,
  }: {
    asset_id: number;
    page: number;
    size: number;
    types: number[];
    warehouse_id: number;
  }): Promise<ResponsePaginationDto<any>> {
    const offset = (page - 1) * size;

    const query = db("asset_transactions as at")
      .join("asset_transaction_items as ati", "ati.transaction_id", "at.id")
      .join("warehouse_asset as wa", "wa.id", "ati.warehouse_asset_id")

      .leftJoin("asset_lifecycle as al", function () {
        this.on("al.transaction_id", "=", "at.id").andOn(
          db.raw("at.type IN (1, 2)"),
        );
      })

      .leftJoin("asset_maintenances as am", function () {
        this.on("am.transaction_id", "=", "at.id").andOn(db.raw("at.type = 3"));
      })

      .select(
        "at.id",
        "at.code",
        "at.type",
        "at.created_at",
        "at.note",
        "at.reason",

        "wa.asset_id",
        "wa.id as warehouse_asset_id",

        "ati.quantity",
        "ati.status",
        "ati.cost",

        // lifecycle
        "al.allocation_date",
        "al.return_deadline",
        "al.return_date",
        "al.disposal_date",

        // maintenance
        "am.status as maintenance_status",
        "am.maintenance_date",
      )

      .where("wa.asset_id", asset_id)
      .andWhere("at.warehouse_id", warehouse_id);

    if (types?.length > 0) {
      query.whereIn("at.type", types);
    }

    const items = await query.limit(size).offset(offset);

    const totalQuery = db("asset_transactions as at")
      .join("asset_transaction_items as ati", "ati.transaction_id", "at.id")
      .join("warehouse_asset as wa", "wa.id", "ati.warehouse_asset_id")
      .where("wa.asset_id", asset_id)
      .andWhere("at.warehouse_id", warehouse_id);

    if (types?.length > 0) {
      totalQuery.whereIn("at.type", types);
    }

    const totalResult = await totalQuery.count({ count: "*" }).first();
    const total = Number(totalResult?.count ?? 0);

    return {
      items,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
}
export default new AssetTransactionsRepository();
