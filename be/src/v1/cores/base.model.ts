export interface IBaseModelAttributes {
  id?: number;
  created_by_user_id?: number | null;
  modified_by_user_id?: number | null;
  deleted_by_user_id?: number | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}