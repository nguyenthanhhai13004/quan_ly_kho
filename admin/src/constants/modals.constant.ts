export const ModalEnum = {
  CLOSE_MODAL: 0,
  CREATE_USER_MODAL: 1,
  EDIT_USER_MODAL: 2,
  DELETE_USER_MODAL: 3,
  PROFILE_MODAL:4,
  CHANGE_PASSWORD:5,

  // assets
  CREATE_ASSET_MODAL:6
} as const;

export type ModalEnumType = 
  (typeof ModalEnum)[keyof typeof ModalEnum];