export function flattenInventoryData(data: any[]) {
  const rows: Record<string, any>[] = [];

  data.forEach((category) => {
    category.assets.forEach((asset:any) => {
      asset.batches.forEach((batch:any) => {
        rows.push({
          category_name: category.category_name,
          asset_name: asset.name,
          asset_code: asset.code,
          batch_code: batch.batch_code,
          quantity: batch.quantity,
          status: batch.status,
          expiration_date: batch.expiration_date,
          maintenance_due: batch.maintenance_due,
        });
      });
    });
  });

  return rows;
}
