export function formatDate(value?: string | Date): string {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString("vi-VN", { hour12: false });
}
