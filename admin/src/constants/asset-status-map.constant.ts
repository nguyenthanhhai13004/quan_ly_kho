export const statusMap: Record<
  string,
  {
    label: string;
    color: "success" | "warning" | "error" | "default";
  }
> = {
  1: { label: "Tốt", color: "success" },
  3: { label: "Cần bảo trì", color: "warning" },
  4: { label: "Hết hạn", color: "default" },
  2: { label: "Lỗi", color: "error" },
};
