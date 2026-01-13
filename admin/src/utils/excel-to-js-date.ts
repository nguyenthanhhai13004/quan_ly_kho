export function excelToJsDate(value: any): Date | null {
  if (!value) return null;

  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + value * 86400000);
  }

  if (typeof value === "string") {
    const v = value.trim();

    const iso = new Date(v);
    if (!isNaN(iso.getTime())) return iso;

    const ddmmyyyySlash = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (ddmmyyyySlash) {
      const [, d, m, y] = ddmmyyyySlash;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }

    const ddmmyyyyDash = v.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (ddmmyyyyDash) {
      const [, d, m, y] = ddmmyyyyDash;
      return new Date(Number(y), Number(m) - 1, Number(d));
    }
  }

  return null;
}
