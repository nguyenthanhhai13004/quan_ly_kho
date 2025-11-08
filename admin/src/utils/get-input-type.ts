import type { SettingValue } from "../models/setting.model";

export function getInputType({
  value,
  unit,
}: {
  value: SettingValue;
  unit: string;
}): string {
  if (typeof value === "boolean") {
    return "checkbox";
  }

  if (unit) {
    const u = unit.toLowerCase();
    if (u === "date") {
      return "datetime-local";
    }
  }

  if (typeof value === "number") {
    return "number";
  }

  return "text";
}
