export const RolesEnum = {
  ADMIN:"admin",
  WAREHOUSE_OFFICER:"warehouse-officer",
  COMMANDER:"commander",
  USER:"user"
} as const;

export type RolesEnum = typeof RolesEnum[keyof typeof RolesEnum];