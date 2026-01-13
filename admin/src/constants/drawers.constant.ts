export const DrawerEnum = {
  CLOSE_DRAWER: 0,
  FILTER_DRAWER:1,
  NAV_DRAWER:2
} as const;

export type DrawerEnumType = 
  (typeof DrawerEnum)[keyof typeof DrawerEnum];