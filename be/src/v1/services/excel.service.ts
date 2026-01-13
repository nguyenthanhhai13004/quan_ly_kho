import dayjs from "dayjs";
import ExcelJS from "exceljs";

export class ExcelService {
  static async generateInventoryWorkbook(
    data: any[],
    warehouseName: string,
    reportDate: string,
    totalQuantity: number,
    reportTitle: string = "BÁO CÁO TỒN KHO",
  ): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Maintenance Report");

    const titleRow = sheet.addRow([reportTitle]);
    titleRow.font = { size: 16, bold: true };
    sheet.mergeCells(`A${titleRow.number}:H${titleRow.number}`);
    sheet.addRow([]);

    sheet.addRow([`Kho: ${warehouseName}`]);
    sheet.addRow([`Ngày xuất: ${reportDate}`]);
    sheet.addRow([`Tổng số lượng tài sản: ${totalQuantity}`]);
    sheet.addRow([]);

    sheet.addRow([
      "Danh mục",
      "Tên tài sản",
      "Mã tài sản",
      "Mã lô",
      "Số lượng",
      "Trạng thái",
      "Ngày hết hạn",
      "Ngày bảo trì",
    ]);

    const headerRowIndex = sheet.lastRow!.number;
    let rowIndex = headerRowIndex + 1;

    data.forEach((category) => {
      const categoryRowSpan = category.assets.reduce(
        (sum: number, asset: any) => sum + asset.batches.length,
        0,
      );
      const categoryStartRow = rowIndex;

      category.assets.forEach((asset: any) => {
        const assetRowSpan = asset.batches.length;
        const assetStartRow = rowIndex;

        asset.batches.forEach((batch: any, i: number) => {
          sheet.addRow([
            i === 0 ? category.category_name : null,
            i === 0 ? asset.name : null,
            i === 0 ? asset.code : null,
            batch.batch_code,
            batch.quantity,
            batch.status,
            batch.expiration_date
              ? dayjs(batch.expiration_date).format("DD/MM/YYYY")
              : null,
            batch.maintenance_due
              ? dayjs(batch.maintenance_due).format("DD/MM/YYYY")
              : null,
          ]);
          rowIndex++;
        });

        if (assetRowSpan > 1) {
          sheet.mergeCells(
            `B${assetStartRow}:B${assetStartRow + assetRowSpan - 1}`,
          );
          sheet.mergeCells(
            `C${assetStartRow}:C${assetStartRow + assetRowSpan - 1}`,
          );
        }
      });

      if (categoryRowSpan > 1) {
        sheet.mergeCells(
          `A${categoryStartRow}:A${categoryStartRow + categoryRowSpan - 1}`,
        );
      }
    });

    sheet.columns.forEach((col) => {
      col.width = 20;
    });

    return workbook;
  }

  /**
   data {"warehouse_name":"Kho Quân nhu Trung ương","users":[{"fullname":"Super Admin","email":"super.admin@gmail.com","assets":[{"id":1,"code":"KQN0521985578","name":"Cấp phát máy tính","allocation_date":"2025-11-28T18:15:00.000Z","return_deadline":"2025-12-28T18:15:00.000Z","return_date":null,"batches":[{"batch_code":"BATCH-TEST-20251128-FF859J","quantity":11,"status":1}]},{"id":5,"code":"KQN8013946725","name":"Cấp phát thiết bị mạng","allocation_date":"2025-11-28T18:15:00.000Z","return_deadline":"2025-12-28T18:15:00.000Z","return_date":null,"batches":[{"batch_code":"BATCH-TEST-20251128-FF859J","quantity":18,"status":1}]}]}]}
   */

  static async generateAllocationWorkbook(
    data: any,
    reportDate: string,
    reportTitle: string = "BÁO CÁO CẤP PHÁT",
  ): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Allocation Report");

    const titleRow = sheet.addRow([reportTitle]);
    titleRow.font = { size: 16, bold: true };
    sheet.mergeCells(`A${titleRow.number}:I${titleRow.number}`);
    sheet.addRow([]);

    sheet.addRow([`Kho: ${data?.warehouse_name || ""}`]);
    sheet.addRow([`Ngày xuất: ${reportDate}`]);
    sheet.addRow([]);

    const totalQuantity = (data?.users || [])
      .flatMap((u: any) => u.assets || [])
      .flatMap((a: any) => a.batches || [])
      .reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);

    sheet.addRow([`Tổng số lượng tài sản: ${totalQuantity}`]);
    sheet.addRow([]);

    // Header
    sheet.addRow([
      "Tên người / Đơn vị",
      "Email",
      "Tên tài sản",
      "Mã tài sản",
      "Ngày cấp",
      "Hạn thu hồi",
      "Mã lô",
      "Số lượng",
    ]);

    let rowIndex = sheet.lastRow!.number + 1;

    (data?.users || []).forEach((user: any) => {
      const userRowSpan = (user.assets || []).reduce(
        (sum: number, a: any) => sum + ((a.batches || []).length || 1),
        0,
      );
      const userStartRow = rowIndex;

      (user.assets || []).forEach((asset: any) => {
        const assetRowSpan = (asset.batches || []).length || 1;
        const assetStartRow = rowIndex;

        (asset.batches || []).forEach((batch: any, i: number) => {
          sheet.addRow([
            i === 0 ? user.fullname : null, // A
            i === 0 ? user.email : null, // B
            i === 0 ? asset.name : null, // C
            i === 0 ? asset.code : null, // D
            asset.allocation_date
              ? dayjs(asset.allocation_date).format("DD/MM/YYYY")
              : "", // E
            asset.return_deadline
              ? dayjs(asset.return_deadline).format("DD/MM/YYYY")
              : "", // F
            batch.batch_code || "", // G
            batch.quantity || 0, // H
          ]);
          rowIndex++;
        });

        if (assetRowSpan > 1) {
          sheet.mergeCells(
            `C${assetStartRow}:C${assetStartRow + assetRowSpan - 1}`,
          );
          sheet.mergeCells(
            `D${assetStartRow}:D${assetStartRow + assetRowSpan - 1}`,
          );
        }
      });

      if (userRowSpan > 1) {
        sheet.mergeCells(`A${userStartRow}:A${userStartRow + userRowSpan - 1}`);
        sheet.mergeCells(`B${userStartRow}:B${userStartRow + userRowSpan - 1}`);
      }
    });

    sheet.columns = [
      { width: 25 }, // Tên người/ĐV
      { width: 25 }, // Email
      { width: 25 }, // Tên tài sản
      { width: 20 }, // Mã tài sản
      { width: 15 }, // Ngày cấp
      { width: 15 }, // Hạn thu hồi
      { width: 20 }, // Mã lô
      { width: 12 }, // Số lượng
      { width: 15 }, // Trạng thái
    ];

    return workbook;
  }

  /*
    data {"transactions":[{"transaction_code":"KQN7570774023","reason":"noi dn","disposal_date":"2025-11-28T17:00:00.000Z","assets":[{"asset_code":"VK-0001","asset_name":"Súng trường CKC","category_name":"Vũ khí","original_value":100000,"disposal_value":5000,"quantity":20,"status":1,"batches":[{"batch_code":"BATCH-TEST-20251128-FF859J","quantity":20,"status":"Tốt"}]}]},{"transaction_code":"KQN3698036178","reason":"aaaa","disposal_date":"2025-11-28T17:00:00.000Z","assets":[{"asset_code":"VK-0001","asset_name":"Súng trường CKC","category_name":"Vũ khí","original_value":100000,"disposal_value":4000,"quantity":1,"status":1,"batches":[{"batch_code":"BATCH-TEST-20251128-FF859J","quantity":1,"status":"Tốt"}]}]},{"transaction_code":"KQN3551405247","reason":"akdjlkasda","disposal_date":"2025-11-28T17:00:00.000Z","assets":[{"asset_code":"VK-0003","asset_name":"Súng ngắn K54","category_name":"Vũ khí","original_value":100000,"disposal_value":7000,"quantity":1,"status":1,"batches":[{"batch_code":"BATCH-TEST-20251128-0B57MG","quantity":1,"status":"Tốt"}]}]},{"transaction_code":"KQN5143489221","reason":"aaaa","disposal_date":"2025-11-28T17:00:00.000Z","assets":[{"asset_code":"VK-0001","asset_name":"Súng trường CKC","category_name":"Vũ khí","original_value":100000,"disposal_value":100,"quantity":2,"status":1,"batches":[{"batch_code":"BATCH-TEST-20251128-FF859J","quantity":2,"status":"Tốt"}]},{"asset_code":"VK-0003","asset_name":"Súng ngắn K54","category_name":"Vũ khí","original_value":100000,"disposal_value":100,"quantity":2,"status":1,"batches":[{"batch_code":"BATCH-TEST-20251128-0B57MG","quantity":2,"status":"Tốt"}]}]},{"transaction_code":"KQN6803856640","reason":"BAS","disposal_date":"2025-11-28T17:00:00.000Z","assets":[{"asset_code":"VT-0004","asset_name":"Nhiên liệu Diesel B2","category_name":"Vật tư tiêu hao","original_value":0,"disposal_value":1000,"quantity":2,"status":1,"batches":[{"batch_code":"BATCH-20-20251128-S55UWZ","quantity":2,"status":"Tốt"}]},{"asset_code":"PT-0003","asset_name":"Xe tải KamAZ 43118","category_name":"Phương tiện","original_value":100000,"disposal_value":999,"quantity":4,"status":1,"batches":[{"batch_code":"BATCH-TEST-20251128-FHX9SA","quantity":4,"status":"Tốt"}]}]}],"totalDepreciation":2882604,"warehouse_name":"Kho Quân nhu Trung ương"}
  */
  static async generateDisposalWorkbook(data: any): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Disposal Report");

    const title = sheet.addRow(["BÁO CÁO THANH LÝ"]);
    title.font = { size: 16, bold: true };
    sheet.mergeCells(`A${title.number}:K${title.number}`);
    sheet.addRow([]);

    sheet.addRow([`Kho: ${data?.warehouse_name ?? ""}`]);
    sheet.addRow([`Tổng giá trị khấu hao: ${data?.totalDepreciation ?? 0}`]);
    sheet.addRow([]);

    sheet.addRow([
      "Mã giao dịch",
      "Lý do",
      "Ngày xử lý",
      "Mã tài sản",
      "Tên tài sản",
      "Nhóm",
      "Giá trị gốc",
      "Giá trị tiêu hủy",
      "Mã lô",
      "Số lượng",
      "Chất lượng",
    ]);

    let rowIndex = sheet.lastRow!.number + 1;

    (data.transactions ?? []).forEach((transaction: any) => {
      const assets = transaction.assets ?? [];
      const transactionRowSpan = assets.reduce(
        (sum: number, a: any) => sum + (a.batches?.length ?? 0),
        0,
      );

      const transactionStartRow = rowIndex;

      assets.forEach((asset: any) => {
        const batches = asset.batches ?? [];
        const assetRowSpan = batches.length;
        const assetStartRow = rowIndex;

        batches.forEach((batch: any, i: number) => {
          sheet.addRow([
            i === 0 ? transaction.transaction_code : null,
            i === 0 ? transaction.reason : null,
            i === 0
              ? dayjs(transaction.disposal_date).format("DD/MM/YYYY")
              : null,
            i === 0 ? asset.asset_code : null,
            i === 0 ? asset.asset_name : null,
            i === 0 ? asset.category_name : null,
            i === 0 ? asset.original_value : null,
            i === 0 ? asset.disposal_value : null,
            batch.batch_code,
            batch.quantity,
            batch.status,
          ]);
          rowIndex++;
        });

        if (assetRowSpan > 1) {
          ["D", "E", "F", "G", "H"].forEach((col) => {
            sheet.mergeCells(
              `${col}${assetStartRow}:${col}${assetStartRow + assetRowSpan - 1}`,
            );
          });
        }
      });

      if (transactionRowSpan > 1) {
        ["A", "B", "C"].forEach((col) => {
          sheet.mergeCells(
            `${col}${transactionStartRow}:${col}${transactionStartRow + transactionRowSpan - 1}`,
          );
        });
      }
    });

    sheet.columns = [
      { width: 18 }, // Mã giao dịch
      { width: 20 }, // Lý do
      { width: 14 }, // Ngày xử lý
      { width: 15 }, // Mã tài sản
      { width: 25 }, // Tên tài sản
      { width: 18 }, // Nhóm
      { width: 15 }, // Giá trị gốc
      { width: 15 }, // Giá trị tiêu hủy
      { width: 20 }, // Mã lô
      { width: 10 }, // Số lượng
      { width: 12 }, // Chất lượng
    ];

    return workbook;
  }

  /*
  data {"rows":[{"transaction_id":10,"asset_code":"VT-0004","asset_name":"Nhiên liệu Diesel B2","maintenance_date":"2025-11-28T17:00:00.000Z","transaction_code":"KQN3993863342","maintenance_status":1,"results":[{"quantity":200,"unit_cost":1000,"status":"Tốt","batch_code":"BATCH-20-20251128-S55UWZ"}]},{"transaction_id":14,"asset_code":"VT-0003","asset_name":"Mực in LaserJet HP 12A","maintenance_date":"2025-11-28T17:00:00.000Z","transaction_code":"KQN5549698680","maintenance_status":0,"results":[{"quantity":10,"unit_cost":500,"batch_code":"BATCH-19-20251129-H7OKKG"},{"quantity":10,"unit_cost":392,"batch_code":"BATCH-20-20251129-GYON2Z"}]}],"totalCost":208920,"warehouse_name":"Kho Quân nhu Trung ương","year":2025,"quarter":4}
  */
  static async generateMaintenanceWorkbook(
    data: any,
    reportTitle: string = "BÁO CÁO BẢO TRÌ",
  ): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Maintenance Report");

    const titleRow = sheet.addRow([reportTitle]);
    titleRow.font = { size: 16, bold: true };
    sheet.mergeCells(`A${titleRow.number}:H${titleRow.number}`);
    sheet.addRow([]);

    sheet.addRow([`Kho: ${data.warehouse_name}`]);
    sheet.addRow([`Năm: ${data.year} - Quý: ${data.quarter}`]);
    sheet.addRow([`Tổng chi phí bảo trì: ${data.totalCost}`]);
    sheet.addRow([]);

    sheet.addRow([
      "Mã giao dịch",
      "Ngày bảo trì",
      "Tên tài sản",
      "Mã tài sản",
      "Mã lô",
      "Số lượng",
      "Đơn giá",
      "Tình trạng",
    ]);

    let rowIndex = sheet.lastRow!.number + 1;

    (data.rows ?? []).forEach((row: any) => {
      const results = row.results ?? [];
      const rowSpan = results.length;
      const startRow = rowIndex;

      results.forEach((r: any, i: number) => {
        sheet.addRow([
          i === 0 ? row.transaction_code : null,
          i === 0 ? dayjs(row.maintenance_date).format("DD/MM/YYYY") : null,
          i === 0 ? row.asset_name : null,
          i === 0 ? row.asset_code : null,
          r.batch_code,
          r.quantity,
          r.unit_cost,
          r.status || "Chưa có kết quả",
        ]);
        rowIndex++;
      });

      if (rowSpan > 1) {
        ["A", "B", "C", "D"].forEach((col) => {
          sheet.mergeCells(`${col}${startRow}:${col}${startRow + rowSpan - 1}`);
        });
      }
    });

    sheet.columns = [
      { width: 20 },
      { width: 15 },
      { width: 25 },
      { width: 15 },
      { width: 22 },
      { width: 12 },
      { width: 12 },
      { width: 15 },
    ];

    return workbook;
  }
}
