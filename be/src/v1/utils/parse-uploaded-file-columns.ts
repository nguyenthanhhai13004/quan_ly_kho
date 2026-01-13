import * as XLSX from "xlsx";

export function parseUploadedFileColumns<T extends Record<string, any>>(
  file: Express.Multer.File,
  requiredFields: (keyof T)[]
): T[] {
  if (!file) {
    throw new Error("File is required");
  }

  const buffer = file.buffer;

  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: null });

  const result = rows.map((row) => {
    const picked: Record<string, any> = {};
    requiredFields.forEach((key) => {
      picked[key as string] = row[key as string] ?? null;
    });
    return picked as T;
  });

  return result;
}
