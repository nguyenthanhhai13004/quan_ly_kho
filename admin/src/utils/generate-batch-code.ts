export default function generateBatchCode(assetCode = "NEW"): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const normalizedAssetCode = assetCode.replace(/[^a-zA-Z0-9-]/g, "") || "NEW";
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();

  return `BATCH-${normalizedAssetCode}-${datePart}-${random}`;
}
