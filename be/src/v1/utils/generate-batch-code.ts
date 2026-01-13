export function generateBatchCode(assetCode: string): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");

  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `BATCH-${assetCode}-${datePart}-${random}`;
}
