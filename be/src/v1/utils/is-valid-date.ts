export default function isValidDate(value: any) {
  if (!value) return false;

  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const parsed = new Date(excelEpoch.getTime() + value * 86400000);

    return !isNaN(parsed.getTime());
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    const iso = new Date(trimmed);
    if (!isNaN(iso.getTime())) return true;

    const ddmmyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [_, d, m, y] = ddmmyyyy;
      const newDate = new Date(Number(y), Number(m) - 1, Number(d));
      return !isNaN(newDate.getTime());
    }
  }

  return false;
}
