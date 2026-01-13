import { differenceInDays, startOfDay } from "date-fns";
import AssetStatusEnum from "../cores/enums/assets-status.enum";

export function resolveStatus(row: any) {
  const today = new Date();
  const expiration = row.expiration_date ? new Date(row.expiration_date) : null;

  const maintenance = row.maintenance_due
    ? new Date(row.maintenance_due)
    : null;

  if (expiration != null && expiration <= today) {
    return AssetStatusEnum.EXPIRED;
  }

  if (row.status == AssetStatusEnum.BROKEN) {
    return AssetStatusEnum.BROKEN;
  }

  // if (maintenance != null) {
  //   const diff = differenceInDays(maintenance, today);
  //   console.log('diff', diff);
  //   if (diff <= 0) return AssetStatusEnum.MAINTENANCE;
  // }
  if (
    maintenance &&
    startOfDay(maintenance).getTime() <= startOfDay(today).getTime()
  ) {
    return AssetStatusEnum.MAINTENANCE;
  }

  return AssetStatusEnum.GOOD;
}
