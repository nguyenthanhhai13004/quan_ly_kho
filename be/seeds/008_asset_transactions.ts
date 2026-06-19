import { Knex } from "knex";
import {
  ASSET_LIFECYCLE_TABLE_NAME,
  ASSET_TRANSACTION_ITEMS_TABLE_NAME,
  ASSET_TRANSACTIONS_TABLE_NAME,
} from "../src/v1/cores/constants/table-name.constant";
import generateTransactionCode from "../src/v1/utils/generate-transaction-code";
import TransactionTypeEnum from "../src/v1/cores/enums/transaction-type.enum";
import AssetStatusEnum from "../src/v1/cores/enums/assets-status.enum";

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  // Deletes ALL existing entries
  await knex("asset_maintenances").del();
  await knex(ASSET_LIFECYCLE_TABLE_NAME).del();
  await knex(ASSET_TRANSACTION_ITEMS_TABLE_NAME).del();
  await knex(ASSET_TRANSACTIONS_TABLE_NAME).del();

  const now = new Date();

  // 1. Default system seeds
  const defaultTxns = [
    {
      id: 1,
      name: "Cấp phát máy tính",
      warehouse_id: 1,
      type: TransactionTypeEnum.ALLOCATION_RETURN,
      note: "Cấp phát cho phòng IT",
      reason: "Dự án mới",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 2,
      name: "Thanh lý thiết bị cũ",
      warehouse_id: 3,
      type: TransactionTypeEnum.DISPOSAL,
      note: "Thanh lý máy in cũ",
      reason: "Không còn sử dụng",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 3,
      name: "Nhập kho vật tư",
      warehouse_id: 4,
      type: TransactionTypeEnum.IMPORT,
      note: "Nhập vật tư cho kho miền Nam",
      reason: "Mua mới bổ sung",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 4,
      name: "Xuất kho vật tư",
      warehouse_id: 5,
      type: TransactionTypeEnum.EXPORT,
      note: "Xuất vật tư cho dự án miền Bắc",
      reason: "Cung cấp cho dự án",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 5,
      name: "Cấp phát thiết bị mạng",
      warehouse_id: 1,
      type: TransactionTypeEnum.ALLOCATION_RETURN,
      note: "Router và switch",
      reason: "Triển khai phòng mạng",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
  ];

  // 2. Specific seeds for Commander (chihuyk48, receiver_id = 4)
  const commanderTxns = [
    {
      id: 6,
      name: "Cấp phát xe tải phục vụ quân sự",
      warehouse_id: 1, // Kho miền Nam
      type: TransactionTypeEnum.ALLOCATION_RETURN,
      note: "Cấp phát xe tải KamAZ",
      reason: "Di chuyển quân",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 7,
      name: "Cấp phát văn phòng phẩm cho văn phòng Chỉ huy",
      warehouse_id: 4, // Kho miền Nam
      type: TransactionTypeEnum.ALLOCATION_RETURN,
      note: "Mực in HP 12A",
      reason: "In ấn tài liệu",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 8,
      name: "Cấp phát nhiên liệu vận hành",
      warehouse_id: 4, // Kho miền Nam
      type: TransactionTypeEnum.ALLOCATION_RETURN,
      note: "Nhiên liệu Diesel B2",
      reason: "Chạy máy phát điện",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 9,
      name: "Cấp phát vũ khí dã ngoại",
      warehouse_id: 4, // Kho miền Nam
      type: TransactionTypeEnum.ALLOCATION_RETURN,
      note: "Dao găm chiến đấu",
      reason: "Huấn luyện dã ngoại",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
    {
      id: 10,
      name: "Bảo trì định kỳ Máy tính xách tay",
      warehouse_id: 1, // Kho TW
      type: TransactionTypeEnum.MAINTENANCE,
      note: "Bảo trì định kỳ",
      reason: "Hỏng màn hình",
      code: generateTransactionCode(),
      created_by_user_id: 2,
    },
  ];

  const allTxns = [...defaultTxns, ...commanderTxns];
  await knex(ASSET_TRANSACTIONS_TABLE_NAME).insert(allTxns);

  // Retrieve warehouse assets dynamically to avoid hardcoded IDs
  const whAssetKamaz = await knex("warehouse_asset").where({ warehouse_id: 1, asset_id: 7 }).first();
  const whAssetInk = await knex("warehouse_asset").where({ warehouse_id: 4, asset_id: 19 }).first();
  const whAssetDiesel = await knex("warehouse_asset").where({ warehouse_id: 4, asset_id: 20 }).first();
  const whAssetKnife = await knex("warehouse_asset").where({ warehouse_id: 4, asset_id: 4 }).first();

  // Update statuses for various states (GOOD, BROKEN, MAINTENANCE)
  if (whAssetInk) {
    await knex("warehouse_asset").where({ id: whAssetInk.id }).update({ status: AssetStatusEnum.BROKEN });
  }
  if (whAssetKnife) {
    await knex("warehouse_asset").where({ id: whAssetKnife.id }).update({ status: AssetStatusEnum.MAINTENANCE });
  }

  // Create default transaction items seed
  const defaultItems = defaultTxns.map((txn) => ({
    transaction_id: txn.id,
    warehouse_asset_id: txn.warehouse_id, // Gán tạm warehouse_asset_id
    quantity: Math.floor(Math.random() * 10) + 1,
    cost: Math.floor(Math.random() * 1000) + 100,
  }));

  // Create commander transaction items seed
  const commanderItems = [
    {
      transaction_id: 6,
      warehouse_asset_id: whAssetKamaz ? whAssetKamaz.id : 4,
      quantity: 11,
      cost: 1200000000,
    },
    {
      transaction_id: 7,
      warehouse_asset_id: whAssetInk ? whAssetInk.id : 15,
      quantity: 1,
      cost: 250000,
    },
    {
      transaction_id: 8,
      warehouse_asset_id: whAssetDiesel ? whAssetDiesel.id : 16,
      quantity: 1,
      cost: 23000,
    },
    {
      transaction_id: 9,
      warehouse_asset_id: whAssetKnife ? whAssetKnife.id : 13,
      quantity: 3,
      cost: 500000,
    },
    {
      transaction_id: 10,
      warehouse_asset_id: 1, // Laptop HP (id 1 in WH 1)
      quantity: 1,
      cost: 150000,
    },
  ];

  const allItems = [...defaultItems, ...commanderItems];
  await knex(ASSET_TRANSACTION_ITEMS_TABLE_NAME).insert(allItems);

  // Create default lifecycles
  const defaultLifecycles = defaultTxns.map((txn) => {
    const allocation_date = txn.type === TransactionTypeEnum.ALLOCATION_RETURN ? now : null;
    const return_deadline = allocation_date ? new Date(allocation_date.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
    return {
      transaction_id: txn.id,
      allocation_date,
      return_deadline,
      receiver_id: txn.warehouse_id, // Gán tạm
      return_date: null,
      disposal_date: txn.type === TransactionTypeEnum.DISPOSAL ? now : null,
    };
  });

  // Create commander lifecycles
  const commanderLifecycles = [
    {
      transaction_id: 6, // KamAZ
      allocation_date: now,
      return_deadline: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // + 1 năm
      receiver_id: 4,
      return_date: null,
      disposal_date: null,
    },
    {
      transaction_id: 7, // Mực in (không thu hồi)
      allocation_date: now,
      return_deadline: null,
      receiver_id: 4,
      return_date: null,
      disposal_date: null,
    },
    {
      transaction_id: 8, // Diesel (đã thu hồi)
      allocation_date: now,
      return_deadline: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
      receiver_id: 4,
      return_date: now, // đã thu hồi ngày hôm nay
      disposal_date: null,
    },
    {
      transaction_id: 9, // Dao găm (không thu hồi)
      allocation_date: now,
      return_deadline: null,
      receiver_id: 4,
      return_date: null,
      disposal_date: null,
    },
  ];

  const allLifecycles = [...defaultLifecycles, ...commanderLifecycles];
  await knex(ASSET_LIFECYCLE_TABLE_NAME).insert(allLifecycles);

  // Seeding maintenance status record
  await knex("asset_maintenances").insert([
    {
      transaction_id: 10,
      maintenance_date: now,
      status: 0, // IN_PROGRESS
      created_by_user_id: 2,
    },
  ]);
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
}
