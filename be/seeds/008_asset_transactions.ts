import { Knex } from "knex";
import {
  ASSET_LIFECYCLE_TABLE_NAME,
  ASSET_TRANSACTION_ITEMS_TABLE_NAME,
  ASSET_TRANSACTIONS_TABLE_NAME,
} from "../src/v1/cores/constants/table-name.constant";
import generateTransactionCode from "../src/v1/utils/generate-transaction-code";
import TransactionTypeEnum from "../src/v1/cores/enums/transaction-type.enum";

const ASSET_TRANSACTIONS_SEED = [
  {
    name: "Cấp phát máy tính",
    warehouse_id: 1,
    type: TransactionTypeEnum.ALLOCATION_RETURN, // allocation
    note: "Cấp phát cho phòng IT",
    reason: "Dự án mới",
  },
  {
    name: "Thanh lý thiết bị cũ",
    warehouse_id: 3,
    type: TransactionTypeEnum.DISPOSAL, // disposal
    note: "Thanh lý máy in cũ",
    reason: "Không còn sử dụng",
  },
  {
    name: "Nhập kho vật tư",
    warehouse_id: 4,
    type: TransactionTypeEnum.IMPORT, // import
    note: "Nhập vật tư cho kho miền Nam",
    reason: "Mua mới bổ sung",
  },
  {
    name: "Xuất kho vật tư",
    warehouse_id: 5,
    type: TransactionTypeEnum.EXPORT, // export
    note: "Xuất vật tư cho dự án miền Bắc",
    reason: "Cung cấp cho dự án",
  },
  {
    name: "Cấp phát thiết bị mạng",
    warehouse_id: 1,
    type: TransactionTypeEnum.ALLOCATION_RETURN, // allocation
    note: "Router và switch",
    reason: "Triển khai phòng mạng",
  },
].map((item, index) => {
  const code = generateTransactionCode();
  return { ...item, code, id: index + 1,created_by_user_id:2};
});

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(ASSET_LIFECYCLE_TABLE_NAME).del();
  await knex(ASSET_TRANSACTION_ITEMS_TABLE_NAME).del();
  await knex(ASSET_TRANSACTIONS_TABLE_NAME).del();

  // Inserts seed entries
  await knex(ASSET_TRANSACTIONS_TABLE_NAME).insert(ASSET_TRANSACTIONS_SEED);

  const ASSET_TRANSACTION_ITEMS_SEED = ASSET_TRANSACTIONS_SEED.map((txn) => ({
    transaction_id: txn.id,
    warehouse_asset_id: txn.warehouse_id, // ví dụ gán tạm warehouse_id
    quantity: Math.floor(Math.random() * 50) + 1, // random 1-50
    cost: Math.floor(Math.random() * 1000) + 100, // random chi phí 100-1100
  }));

  await knex(ASSET_TRANSACTION_ITEMS_TABLE_NAME).insert(ASSET_TRANSACTION_ITEMS_SEED);

  const ASSET_LIFECYCLE_SEED = ASSET_TRANSACTIONS_SEED.map((txn) => {
    const now = new Date();
    const allocation_date = txn.type === 1 ? now : null; // allocation mới có ngày cấp phát
    const return_deadline = allocation_date ? new Date(allocation_date.getTime() + 30*24*60*60*1000) : null; // +30 ngày
    return {
      transaction_id: txn.id,
      allocation_date,
      return_deadline,
      receiver_id: txn.warehouse_id,
      return_date: txn.type === 2 ? now : null,
      disposal_date: txn.type === 3 ? now : null,
    };
  });

  await knex(ASSET_LIFECYCLE_TABLE_NAME).insert(ASSET_LIFECYCLE_SEED);
}
