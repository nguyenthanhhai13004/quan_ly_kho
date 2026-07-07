import { Knex } from "knex";
import {
  ASSET_EXPORTS_TABLE_NAME,
  ASSET_IMPORTS_TABLE_NAME,
  ASSET_LIFECYCLE_TABLE_NAME,
  ASSET_TRANSACTION_ITEMS_TABLE_NAME,
  ASSET_TRANSACTIONS_TABLE_NAME,
} from "../src/v1/cores/constants/table-name.constant";
import generateTransactionCode from "../src/v1/utils/generate-transaction-code";
import TransactionTypeEnum from "../src/v1/cores/enums/transaction-type.enum";
import AssetStatusEnum from "../src/v1/cores/enums/assets-status.enum";

const MILITARY_SCIENCE_ACADEMY_WAREHOUSE_ID = 7;
const SEED_CREATED_BY_USER_ID = 2;

type WarehouseAssetSeedRow = {
  id: number;
  warehouse_id: number;
  asset_id: number;
  quantity: number;
  cost: number;
  status: number;
  batch_code: string;
};

type AcademyTrendSeeds = {
  transactions: Record<string, any>[];
  items: Record<string, any>[];
  imports: Record<string, any>[];
  exports: Record<string, any>[];
};

const IMPORT_COUNT_BY_MONTH = [3, 5, 2, 6, 4, 7, 3, 5, 8, 4, 6, 5];
const EXPORT_COUNT_BY_MONTH = [2, 4, 5, 3, 6, 2, 5, 7, 4, 6, 3, 8];

const IMPORT_NAMES = [
  "Nhập bổ sung quân nhu huấn luyện",
  "Nhập trang bị phục vụ học viên",
  "Nhập vật tư bảo đảm thường xuyên",
  "Nhập bổ sung kho học viện",
  "Nhập thiết bị phục vụ diễn tập",
];

const EXPORT_NAMES = [
  "Xuất phục vụ huấn luyện",
  "Xuất bảo đảm nhiệm vụ học viện",
  "Xuất trang bị cho đơn vị nhận",
  "Xuất vật tư phục vụ diễn tập",
  "Xuất theo kế hoạch bảo đảm",
];

function getLastTwelveMonths(now: Date): Date[] {
  return Array.from({ length: 12 }, (_, index) => {
    const monthOffset = 11 - index;
    return new Date(now.getFullYear(), now.getMonth() - monthOffset, 1, 8);
  });
}

function createDateInMonth(monthStart: Date, daySeed: number, hour: number, now: Date) {
  const isCurrentMonth =
    monthStart.getFullYear() === now.getFullYear() &&
    monthStart.getMonth() === now.getMonth();
  const lastDay = isCurrentMonth
    ? now.getDate()
    : new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const day = 1 + (daySeed % Math.max(lastDay, 1));

  return new Date(
    monthStart.getFullYear(),
    monthStart.getMonth(),
    day,
    hour,
    0,
    0,
    0,
  );
}

function formatDatePart(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function createSeedTransactionCode(
  type: TransactionTypeEnum,
  date: Date,
  sequence: number,
): string {
  const typeCode = type === TransactionTypeEnum.IMPORT ? "NK" : "XK";
  return `KQN-${typeCode}-${formatDatePart(date)}-${String(sequence).padStart(3, "0")}`;
}

function pickWarehouseAssetRows(
  rows: WarehouseAssetSeedRow[],
  monthIndex: number,
  transactionIndex: number,
  lineCount: number,
): WarehouseAssetSeedRow[] {
  return Array.from({ length: lineCount }, (_, lineIndex) => {
    const index = (monthIndex * 17 + transactionIndex * 5 + lineIndex * 9) % rows.length;
    return rows[index];
  });
}

function createAcademyImportExportSeeds(
  warehouseAssets: WarehouseAssetSeedRow[],
  now: Date,
): AcademyTrendSeeds {
  const seeds: AcademyTrendSeeds = {
    transactions: [],
    items: [],
    imports: [],
    exports: [],
  };

  if (warehouseAssets.length === 0) {
    return seeds;
  }

  let transactionId = 1000;
  let sequence = 1;
  const months = getLastTwelveMonths(now);

  months.forEach((monthStart, monthIndex) => {
    const importCount = IMPORT_COUNT_BY_MONTH[monthIndex];
    const exportCount = EXPORT_COUNT_BY_MONTH[monthIndex];

    for (let i = 0; i < importCount; i++) {
      const createdAt = createDateInMonth(monthStart, i * 4 + monthIndex, 9, now);
      const type = TransactionTypeEnum.IMPORT;
      const currentTransactionId = transactionId++;
      const lineRows = pickWarehouseAssetRows(warehouseAssets, monthIndex, i, 1 + ((i + monthIndex) % 3));

      seeds.transactions.push({
        id: currentTransactionId,
        name: `${IMPORT_NAMES[(i + monthIndex) % IMPORT_NAMES.length]} ${String(monthIndex + 1).padStart(2, "0")}`,
        warehouse_id: MILITARY_SCIENCE_ACADEMY_WAREHOUSE_ID,
        type,
        note: "Seed demo xu hướng nhập kho trong 12 tháng",
        reason: "Bổ sung định kỳ cho Kho Quân Nhu Học viện Khoa Học Quân Sự",
        code: createSeedTransactionCode(type, createdAt, sequence++),
        created_by_user_id: SEED_CREATED_BY_USER_ID,
        created_at: createdAt,
        updated_at: createdAt,
      });

      seeds.imports.push({
        transaction_id: currentTransactionId,
        received_date: createdAt,
        sender_location: i % 2 === 0 ? "Cục Quân nhu" : "Phòng Hậu cần Học viện",
        created_by_user_id: SEED_CREATED_BY_USER_ID,
        created_at: createdAt,
        updated_at: createdAt,
      });

      lineRows.forEach((row, lineIndex) => {
        seeds.items.push({
          transaction_id: currentTransactionId,
          warehouse_asset_id: row.id,
          quantity: 6 + ((monthIndex + i + lineIndex) % 18),
          cost: row.cost,
          status: row.status || AssetStatusEnum.GOOD,
          created_by_user_id: SEED_CREATED_BY_USER_ID,
          created_at: createdAt,
          updated_at: createdAt,
        });
      });
    }

    for (let i = 0; i < exportCount; i++) {
      const createdAt = createDateInMonth(monthStart, i * 3 + monthIndex + 2, 14, now);
      const type = TransactionTypeEnum.EXPORT;
      const currentTransactionId = transactionId++;
      const lineRows = pickWarehouseAssetRows(warehouseAssets, monthIndex, i + 40, 1 + ((i + monthIndex) % 2));

      seeds.transactions.push({
        id: currentTransactionId,
        name: `${EXPORT_NAMES[(i + monthIndex) % EXPORT_NAMES.length]} ${String(monthIndex + 1).padStart(2, "0")}`,
        warehouse_id: MILITARY_SCIENCE_ACADEMY_WAREHOUSE_ID,
        type,
        note: "Seed demo xu hướng xuất kho trong 12 tháng",
        reason: "Bảo đảm vật chất cho các hệ đào tạo và nhiệm vụ học viện",
        code: createSeedTransactionCode(type, createdAt, sequence++),
        created_by_user_id: SEED_CREATED_BY_USER_ID,
        created_at: createdAt,
        updated_at: createdAt,
      });

      seeds.exports.push({
        transaction_id: currentTransactionId,
        export_date: createdAt,
        receiver_name: i % 3 === 0 ? "Ban Hậu cần Học viện" : "Đơn vị huấn luyện",
        receiver_phone: `09${String(12000000 + monthIndex * 1000 + i * 37).padStart(8, "0")}`,
        receiver_address: "Học viện Khoa Học Quân Sự",
        created_by_user_id: SEED_CREATED_BY_USER_ID,
        created_at: createdAt,
        updated_at: createdAt,
      });

      lineRows.forEach((row, lineIndex) => {
        seeds.items.push({
          transaction_id: currentTransactionId,
          warehouse_asset_id: row.id,
          quantity: 1 + ((monthIndex + i + lineIndex) % 9),
          cost: row.cost,
          status: row.status || AssetStatusEnum.GOOD,
          created_by_user_id: SEED_CREATED_BY_USER_ID,
          created_at: createdAt,
          updated_at: createdAt,
        });
      });
    }
  });

  return seeds;
}

export async function seed(knex: Knex): Promise<void> {
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  // Deletes ALL existing entries
  await knex("asset_maintenances").del();
  await knex(ASSET_IMPORTS_TABLE_NAME).del();
  await knex(ASSET_EXPORTS_TABLE_NAME).del();
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

  const academyWarehouseAssets = await knex<WarehouseAssetSeedRow>(
    "warehouse_asset",
  )
    .select(
      "id",
      "warehouse_id",
      "asset_id",
      "quantity",
      "cost",
      "status",
      "batch_code",
    )
    .where({ warehouse_id: MILITARY_SCIENCE_ACADEMY_WAREHOUSE_ID })
    .orderBy("id", "asc");

  const academySeeds = createAcademyImportExportSeeds(
    academyWarehouseAssets,
    now,
  );

  if (academySeeds.transactions.length > 0) {
    await knex(ASSET_TRANSACTIONS_TABLE_NAME).insert(academySeeds.transactions);
    await knex(ASSET_IMPORTS_TABLE_NAME).insert(academySeeds.imports);
    await knex(ASSET_EXPORTS_TABLE_NAME).insert(academySeeds.exports);
    await knex(ASSET_TRANSACTION_ITEMS_TABLE_NAME).insert(academySeeds.items);
  }

  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
}
