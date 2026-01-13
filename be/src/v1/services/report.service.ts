import TransactionTypeEnum from "../cores/enums/transaction-type.enum";
import db from "../databases/init.mysql-v2";
import {
  calculateAssetStatus,
  getAssetStatusText,
} from "../utils/asset-status";

type BatchAllocation = {
  batch_code: string;
  quantity: number;
  status: string;
};

type AssetAllocation = {
  id: number;
  code: string;
  name: string;
  allocation_date?: string;
  return_deadline?: string;
  return_date?: string;
  batches: BatchAllocation[];
};

type UserAllocation = {
  fullname: string;
  email: string;
  assets: AssetAllocation[];
};

class ReportService {
  static async getInventoryReport({ warehouse_id }: { warehouse_id: number }) {
    const warehouse = await db("warehouses")
      .select("name")
      .where("id", warehouse_id)
      .first();

    const data = await db("warehouse_asset as wa")
      .join("assets as a", "a.id", "wa.asset_id")
      .leftJoin("categories as c", "c.id", "a.category_id")
      .select(
        "a.code as asset_code",
        "a.name as asset_name",
        "c.id as category_id",
        "c.name as category_name",
        "wa.quantity",
        "wa.status",
        "wa.batch_code",
        "wa.expiration_date",
        "wa.maintenance_due",
      )
      .where("wa.warehouse_id", warehouse_id);

    const dataWithStatusText = data.map((item) => {
      const dynamicStatus = calculateAssetStatus(
        item.expiration_date ? new Date(item.expiration_date) : undefined,
        item.maintenance_due ? new Date(item.maintenance_due) : undefined,
      );

      return {
        ...item,
        status: getAssetStatusText(dynamicStatus),
      };
    });

    const categoryMap = new Map<string, any>();
    let totalQuantity = 0;

    dataWithStatusText.forEach((row) => {
      totalQuantity += row.quantity || 0;

      if (!categoryMap.has(row.category_id)) {
        categoryMap.set(row.category_id, {
          id: row.category_id,
          category_name: row.category_name,
          assets: [],
        });
      }

      const category = categoryMap.get(row.category_id);

      let asset = category.assets.find((a: any) => a.code === row.asset_code);
      if (!asset) {
        asset = {
          name: row.asset_name,
          code: row.asset_code,
          batches: [],
        };
        category.assets.push(asset);
      }

      asset.batches.push({
        batch_code: row.batch_code ?? "",
        quantity: row.quantity,
        status: row.status,
        expiration_date: row.expiration_date,
        maintenance_due: row.maintenance_due,
      });
    });

    return {
      warehouse_name: warehouse?.name || "",
      total_quantity: totalQuantity,
      categories: Array.from(categoryMap.values()),
    };
  }

  /**
   Báo cáo cấp phát
  •	Danh sách người/đơn vị đang giữ tài sản
  •	Với mỗi: Danh sách tài sản, Số lượng, Ngày cấp, Hạn thu hồi, Tình trạng
  • Phải có tên kho
   */
  static async getAllocationReport({
    start_date,
    end_date,
    warehouse_id,
  }: {
    start_date?: string;
    end_date?: string;
    warehouse_id: number;
  }): Promise<{ warehouse_name: string; users: UserAllocation[] }> {
    const rows = await db("users")
      .leftJoin("asset_lifecycle", "users.id", "asset_lifecycle.receiver_id")
      .leftJoin(
        "asset_transactions",
        "asset_lifecycle.transaction_id",
        "asset_transactions.id",
      )
      .leftJoin(
        "asset_transaction_items",
        "asset_transactions.id",
        "asset_transaction_items.transaction_id",
      )
      .leftJoin(
        "warehouse_asset",
        "asset_transaction_items.warehouse_asset_id",
        "warehouse_asset.id",
      )
      .leftJoin("warehouses as w", "asset_transactions.warehouse_id", "w.id")
      .leftJoin("assets", "warehouse_asset.asset_id", "assets.id")
      .where("asset_transactions.warehouse_id", warehouse_id)
      .whereNull("asset_lifecycle.return_date")
      // .whereNotNull("asset_lifecycle.return_deadline")
      .modify((qb) => {
        if (start_date)
          qb.where("asset_lifecycle.allocation_date", ">=", start_date);
        if (end_date)
          qb.where("asset_lifecycle.allocation_date", "<=", end_date);
      })
      .select(
        "users.id as user_id",
        "users.fullname",
        "users.email",
        "asset_transactions.id as asset_id",
        "asset_transactions.code as transaction_code",
        "assets.code as asset_code",
        "assets.name as asset_name",
        "asset_transactions.name as transaction_name",
        "asset_lifecycle.allocation_date",
        "asset_lifecycle.return_deadline",
        "asset_lifecycle.return_date",
        "warehouse_asset.batch_code",
        "asset_transaction_items.quantity",
        db.raw(
          `COALESCE(asset_transaction_items.status, warehouse_asset.status) as batch_status`,
        ),
        "w.name as warehouse_name",
      );

    const reportMap = new Map<number, UserAllocation>();

    rows.forEach((row: any) => {
      if (!reportMap.has(row.user_id)) {
        reportMap.set(row.user_id, {
          fullname: row.fullname,
          email: row.email,
          assets: [],
        });
      }

      const user = reportMap.get(row.user_id)!;

      let asset = user.assets.find((a) => a.id === row.asset_id);
      if (!asset) {
        asset = {
          id: row.asset_id,
          code: row.asset_code,
          name: row.asset_name,
          allocation_date: row.allocation_date,
          return_deadline: row.return_deadline,
          return_date: row.return_date,
          batches: [],
        };
        user.assets.push(asset);
      }

      if (row.batch_code) {
        asset.batches.push({
          batch_code: row.batch_code,
          quantity: Number(row.quantity),
          status: getAssetStatusText(row.batch_status),
        });
      }
    });

    return {
      warehouse_name: rows[0]?.warehouse_name || "",
      users: Array.from(reportMap.values()),
    };
  }

  /**
  •	Lịch bảo trì theo quý/năm: Tài sản, Ngày, Chi phí, Kết quả
  •	Tổng chi phí bảo trì
   */
  static async getMaintenanceReport({
    warehouse_id,
    status,
    quarter,
    year,
  }: {
    warehouse_id: number;
    status?: string;
    quarter?: number;
    year?: number;
  }) {
    const warehouse = await db("warehouses")
      .select("name")
      .where("id", warehouse_id)
      .first();

    const maintenances = await db("asset_maintenances as am")
      .join("asset_transactions as at", "at.id", "am.transaction_id")
      .join("asset_transaction_items as ati", "ati.transaction_id", "at.id")
      .join("warehouse_asset as wa", "ati.warehouse_asset_id", "wa.id")
      .join("assets as a", "a.id", "wa.asset_id")
      .select(
        "at.id as transaction_id",
        "at.code as transaction_code",
        "a.name as asset_name",
        "a.code as asset_code",
        "am.maintenance_date",
        "wa.batch_code",
        "am.status as maintenance_status",
        "ati.quantity",
        "ati.cost as unit_cost",
        "ati.status as item_status",
      )
      .where("at.type", TransactionTypeEnum.MAINTENANCE)
      .andWhere("at.warehouse_id", warehouse_id)
      .modify((qb) => {
        if (status) qb.where("am.status", status);
        if (year) qb.whereRaw("YEAR(am.maintenance_date) = ?", [year]);
        if (quarter) qb.whereRaw("QUARTER(am.maintenance_date) = ?", [quarter]);
      });

    const reportMap = new Map<number, any>();

    maintenances.forEach((row: any) => {
      if (!reportMap.has(row.transaction_id)) {
        reportMap.set(row.transaction_id, {
          transaction_id: row.transaction_id,
          asset_code: row.asset_code,
          asset_name: row.asset_name,
          maintenance_date: row.maintenance_date,
          transaction_code: row.transaction_code,
          maintenance_status: row.maintenance_status,
          results: [],
        });
      }
      const maintenance = reportMap.get(row.transaction_id);

      if (row.maintenance_status === 1) {
        maintenance.results.push({
          quantity: row.quantity,
          unit_cost: row.unit_cost,
          status: getAssetStatusText(row.item_status),
          batch_code: row.batch_code,
        });
      } else {
        maintenance.results.push({
          quantity: row.quantity,
          unit_cost: row.unit_cost,
          batch_code: row.batch_code,
        });
      }
    });

    let totalCost = 0;
    reportMap.forEach((m) => {
      m.results.forEach((r: any) => {
        totalCost += (Number(r.unit_cost) || 0) * (Number(r.quantity) || 0);
      });
    });

    return {
      rows: Array.from(reportMap.values()),
      totalCost,
      warehouse_name: warehouse?.name || "",
    };
  }

  /**
   •	Danh sách thanh lý: Mã, Tên, Danh mục, Ngày, Lý do, Giá trị ban đầu, Giá trị thanh lý
   •	Tổng suy giảm giá trị

   */
  static async getDisposalReport({ warehouse_id }: { warehouse_id: number }) {
  const warehouse = await db("warehouses")
    .select("name")
    .where("id", warehouse_id)
    .first();

  const rows = await db("asset_lifecycle as al")
    .join("asset_transactions as at", "at.id", "al.transaction_id")
    .join("asset_transaction_items as ati", "ati.transaction_id", "at.id")
    .join("warehouse_asset as wa", "ati.warehouse_asset_id", "wa.id")
    .join("assets as a", "a.id", "wa.asset_id")
    .join("categories as c", "c.id", "a.category_id")
    .select(
      "at.code as transaction_code",
      "a.code as asset_code",
      "a.name as asset_name",
      "c.name as category_name",
      "al.disposal_date",
      "at.reason",
      "wa.cost as original_value",
      "ati.cost as disposal_value",
      "ati.quantity",
      "ati.status",
      "wa.batch_code",
    )
    .where("at.type", TransactionTypeEnum.DISPOSAL)
    .andWhere("at.warehouse_id", warehouse_id);

  const reportMap = new Map<string, any>();

  rows.forEach((row) => {
    if (!reportMap.has(row.transaction_code)) {
      reportMap.set(row.transaction_code, {
        transaction_code: row.transaction_code,
        reason: row.reason,
        disposal_date: row.disposal_date,
        assets: [],
      });
    }
    const transaction = reportMap.get(row.transaction_code);

    let asset = transaction.assets.find((a:any) => a.asset_code === row.asset_code);
    if (!asset) {
      asset = {
        asset_code: row.asset_code,
        asset_name: row.asset_name,
        category_name: row.category_name,
        original_value: Number(row.original_value),
        disposal_value: Number(row.disposal_value),
        quantity: 0,
        status: row.status,
        batches: [],
      };
      transaction.assets.push(asset);
    }

    asset.quantity += Number(row.quantity);

    if (row.batch_code) {
      asset.batches.push({
        batch_code: row.batch_code,
        quantity: Number(row.quantity),
        status: getAssetStatusText(row.status),
      });
    }
  });

  const totalDepreciation = Array.from(reportMap.values()).reduce((sum, transaction) => {
    return sum + transaction.assets.reduce((s:any, asset:any) => {
      const original = Number(asset.original_value) || 0;
      const disposal = Number(asset.disposal_value) || 0;
      const qty = Number(asset.quantity) || 0;
      return s + (original - disposal) * qty;
    }, 0);
  }, 0);

  return {
    transactions: Array.from(reportMap.values()),
    totalDepreciation,
    warehouse_name: warehouse?.name || "",
  };
}
}

export default ReportService;
