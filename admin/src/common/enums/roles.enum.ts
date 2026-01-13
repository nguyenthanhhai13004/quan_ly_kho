export const RolesEnum = {
  ADMIN:"admin",
  WAREHOUSE_OFFICER:"warehouse-officer",
  USER:"user"
} as const;

export type RolesEnum = typeof RolesEnum[keyof typeof RolesEnum];