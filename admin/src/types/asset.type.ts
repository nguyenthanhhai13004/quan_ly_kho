import type { TCategory } from "./category.type";

export type TAsset = {
  id: number;
  name: string;
  description?: string;
  code: string;
  image_url?: string;
  cost: number;
  category: TCategory;
  status: number;
  import_date: Date;
  maintenance_due: Date;
  quantity: number;
};
