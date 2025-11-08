export interface ResponseItemDto {
  id: number;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdByUserId?: number | null;
  modifiedByUserId?: number | null;
  deletedByUserId?: number | null;
}
