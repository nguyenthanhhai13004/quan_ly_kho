import dayjs from "dayjs";

type Batch = {
  batch_code: string;
  quantity: number;
  status: string;
  expiration_date?: string;
  maintenance_due?: string;
};

type AssetItem = {
  code: string;
  name: string;
  batches?: Batch[];
};

type DataObject = {
  category_name: string;
  assets: AssetItem[];
};

type DisposalItem = {
  asset_code: string;
  asset_name: string;
  category_name: string;
  disposal_date: string;
  reason: string;
  original_value: number;
  disposal_value: number;
  quantity: number;
  status: number;
  batches?: { batch_code: string; quantity: number; status: string }[];
};

type UserAllocation = {
  fullname: string;
  email: string;
  assets: AssetItem[];
};

type AllocationData = {
  warehouse_name: string;
  users: UserAllocation[];
};

export interface MaintenanceItem {
  date: string;
  cost: number;
  technician: string;
  result: string;
}

export interface AssetMaintenance {
  asset_name: string;
  asset_code: string;
  maintenances: MaintenanceItem[];
}

export interface MaintenanceReportData {
  assets: AssetMaintenance[];
  total_cost: number;
}

export function renderInventoryReport(
  template: string,
  data: DataObject[],
  warehouseName?: string,
  reportDate?: string,
  totalQuantity?: number,
): string {
  let result = template;

  if (warehouseName)
    result = result.replace("{{WAREHOUSE_NAME}}", warehouseName);
  if (reportDate) result = result.replace("{{REPORT_DATE}}", reportDate);
  if (totalQuantity !== undefined)
    result = result.replace("{{TOTAL_QUANTITY}}", totalQuantity.toString());

  const categoryMatch = template.match(
    /<!-- CATEGORY_LOOP_START -->([\s\S]*?)<!-- CATEGORY_LOOP_END -->/,
  );
  if (!categoryMatch) return result;
  const categoryTemplate = categoryMatch[1];

  let categoriesHTML = "";

  data.forEach((category) => {
    let categoryBlock = categoryTemplate.replace(
      "{{CATEGORY_NAME}}",
      category.category_name,
    );

    const assetMatch = categoryTemplate.match(
      /<!-- ASSET_LOOP_START -->([\s\S]*?)<!-- ASSET_LOOP_END -->/,
    );
    if (!assetMatch) return;
    const assetTemplate = assetMatch[1];

    let assetsHTML = "";

    category.assets.forEach((asset, assetIndex) => {
      let assetBlock = assetTemplate
        .replace("{{ASSET_INDEX}}", (assetIndex + 1).toString())
        .replace("{{ASSET_CODE}}", asset.code)
        .replace("{{ASSET_NAME}}", asset.name);

      const batchMatch = assetTemplate.match(
        /<!-- BATCH_LOOP_START -->([\s\S]*?)<!-- BATCH_LOOP_END -->/,
      );
      if (!batchMatch) return;
      const batchTemplate = batchMatch[1];

      let batchesHTML = "";

      asset.batches?.forEach((batch) => {
        const batchBlock = batchTemplate
          .replace("{{BATCH_CODE}}", batch.batch_code)
          .replace("{{BATCH_QUANTITY}}", batch.quantity.toString())
          .replace("{{BATCH_STATUS}}", batch.status)
          .replace("{{BATCH_EXPIRATION}}", batch.expiration_date ? dayjs(batch.expiration_date).format("DD/MM/YYYY"):"Không có hạn sử dụng")
          .replace("{{BATCH_MAINTENANCE}}", batch.maintenance_due ? dayjs(batch.maintenance_due).format("DD/MM/YYYY"):"Không có hạn bảo trì");

        batchesHTML += batchBlock;
      });

      assetBlock = assetBlock.replace(batchMatch[0], batchesHTML);
      assetsHTML += assetBlock;
    });

    categoryBlock = categoryBlock.replace(assetMatch[0], assetsHTML);
    categoriesHTML += categoryBlock;
  });

  result = result.replace(categoryMatch[0], categoriesHTML);

  return result;
}

export function renderAllocationReport(
  template: string,
  data: AllocationData,
): string {
  let result = template;

  result = result.replace("{{WAREHOUSE_NAME}}", data.warehouse_name);
  result = result.replace("{{REPORT_DATE}}", dayjs().format("DD/MM/YYYY"));

  const usersMatch = template.match(
    /<!-- USERS_LOOP_START -->([\s\S]*?)<!-- USERS_LOOP_END -->/,
  );
  if (!usersMatch) return result;
  const userTemplate = usersMatch[1];

  let usersHTML = "";

  data.users.forEach((user: any) => {
    let userBlock = userTemplate
      .replace(/{{USER_FULLNAME}}/g, user.fullname)
      .replace(/{{USER_EMAIL}}/g, user.email);

    const assetsMatch = userTemplate.match(
      /<!-- ASSETS_LOOP_START -->([\s\S]*?)<!-- ASSETS_LOOP_END -->/,
    );
    if (!assetsMatch) return;
    const assetTemplate = assetsMatch[1];

    let assetsHTML = "";

    user.assets.forEach((asset: any) => {
      let assetBlock = assetTemplate
        .replace(/{{ASSET_CODE}}/g, asset.code)
        .replace(/{{ASSET_NAME}}/g, asset.name)
        .replace(
          /{{ALLOCATION_DATE}}/g,
          dayjs(asset.allocation_date).format("DD/MM/YYYY HH:mm"),
        )
        .replace(
          /{{RETURN_DEADLINE}}/g,
          dayjs(asset.return_deadline).format("DD/MM/YYYY"),
        )
        .replace(
          /{{RETURN_DATE}}/g,
          asset.return_date
            ? dayjs(asset.return_date).format("DD/MM/YYYY")
            : "",
        );

      const batchMatch = assetTemplate.match(
        /<!-- BATCH_LOOP_START -->([\s\S]*?)<!-- BATCH_LOOP_END -->/,
      );
      if (!batchMatch) return;
      const batchTemplate = batchMatch[1];

      let batchesHTML = "";
      asset.batches?.forEach((batch: any) => {
        let batchBlock = batchTemplate
          .replace(/{{BATCH_CODE}}/g, batch.batch_code)
          .replace(/{{BATCH_QUANTITY}}/g, batch.quantity.toString())
          // .replace(/{{BATCH_STATUS}}/g, batch.status.toString());
        batchesHTML += batchBlock;
      });

      assetBlock = assetBlock.replace(batchMatch[0], batchesHTML);
      assetsHTML += assetBlock;
    });

    userBlock = userBlock.replace(assetsMatch[0], assetsHTML);
    usersHTML += userBlock;
  });

  result = result.replace(usersMatch[0], usersHTML);
  return result;
}

export function renderDisposalReport(
  template: string,
  data: { transactions: any[]; totalDepreciation: number },
  warehouse_name: string,
  report_date: string,
) {
  const transactionLoopMatch = template.match(
    /<!-- CATEGORY_LOOP_START -->([\s\S]*?)<!-- CATEGORY_LOOP_END -->/,
  );
  if (!transactionLoopMatch) return template;
  const transactionTemplate = transactionLoopMatch[1];

  const assetLoopMatch = transactionTemplate.match(
    /<!-- ASSET_LOOP_START -->([\s\S]*?)<!-- ASSET_LOOP_END -->/,
  );
  const assetTemplate = assetLoopMatch ? assetLoopMatch[1] : "";

  const batchLoopMatch = assetTemplate.match(
    /<!-- BATCH_LOOP_START -->([\s\S]*?)<!-- BATCH_LOOP_END -->/,
  );
  const batchTemplate = batchLoopMatch ? batchLoopMatch[1] : "";

  let html = "";

  data.transactions.forEach((transaction) => {
    let transactionHTML = transactionTemplate
      .replace("{{TRANSACTION_CODE}}", transaction.transaction_code)
      .replace("{{REASON}}", transaction.reason || "");

    let assetsHTML = "";
    transaction.assets.forEach((asset:any) => {
      let assetHTML = assetTemplate
        .replace("{{ASSET_CODE}}", asset.asset_code)
        .replace("{{ASSET_NAME}}", asset.asset_name)
        .replace("{{CATEGORY_NAME}}", asset.category_name);

      if (asset.batches && batchLoopMatch) {
        let batchesHTML = "";
        asset.batches.forEach((b:any) => {
          batchesHTML += batchTemplate
            .replace("{{ORIGINAL_VALUE}}", asset.original_value?.toLocaleString() || "0")
            .replace("{{DISPOSAL_VALUE}}", asset.disposal_value?.toLocaleString() || "0")
            .replace("{{BATCH_QUANTITY}}", b.quantity?.toString() || "0")
            .replace("{{BATCH_STATUS}}", b.status || "");
        });
        assetHTML = assetHTML.replace(batchLoopMatch[0], batchesHTML);
      } else if (batchLoopMatch) {
        assetHTML = assetHTML.replace(batchLoopMatch[0], "");
      }

      assetsHTML += assetHTML;
    });

    transactionHTML = transactionHTML.replace(assetLoopMatch?.[0] || "", assetsHTML);

    html += transactionHTML;
  });

  return template
    .replace(transactionLoopMatch[0], html)
    .replace("{{TOTAL_DEPRECIATION}}", data.totalDepreciation.toLocaleString())
    .replace("{{WAREHOUSE_NAME}}", warehouse_name)
    .replace("{{REPORT_DATE}}", report_date);
}


export function renderMaintenanceReport(template: string, data: any) {
  template = template.replace(/{{warehouse_name}}/g, data.warehouse_name || "");
  template = template.replace(
    /{{total_cost}}/g,
    data.totalCost?.toLocaleString() || "0",
  );
  template = template.replace(/{{quarter}}/g, data.quarter || "");
  template = template.replace(/{{year}}/g, data.year || "");

  const maintBlockMatch = template.match(
    /<!-- MAINT_START -->([\s\S]*?)<!-- MAINT_END -->/,
  );

  if (!maintBlockMatch) {
    console.error("Không tìm thấy block MAINT_START / MAINT_END");
    return template;
  }

  const maintBlock = maintBlockMatch[1];
  let maintHTML = "";

  for (const transaction of data.rows) {
    const details = `
  <table style="width:100%; border-collapse: collapse;">
    <tbody>
      ${transaction.results
        .map((r: any) => {
          const cost = Number(r.unit_cost || 0) * Number(r.quantity || 0);
          return `
          <tr>
            <td style="border:1px solid #000; padding:4px;">${r.batch_code || "-"}</td>
            <td style="border:1px solid #000; padding:4px;">${transaction.asset_code}</td>
            <td style="border:1px solid #000; padding:4px;">${transaction.asset_name}</td>
            <td style="border:1px solid #000; padding:4px;">${cost.toLocaleString()}</td>
            <td style="border:1px solid #000; padding:4px;">${r.status || "Chưa có kết quả"}</td>
          </tr>
        `;
        })
        .join("")}
    </tbody>
  </table>
`;

    let row = maintBlock;
    row = row.replace(/{{transaction_code}}/g, transaction.transaction_code);
    row = row.replace(
      /{{date}}/g,
      dayjs(transaction.maintenance_date).format("DD/MM/YYYY"),
    );
    row = row.replace(/{{details}}/g, details);

    maintHTML += row;
  }

  template = template.replace(
    /<!-- MAINT_START -->[\s\S]*?<!-- MAINT_END -->/,
    maintHTML,
  );

  return template;
}
