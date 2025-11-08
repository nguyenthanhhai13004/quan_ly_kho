import { ResponseItemDto } from "../../cores/dtos/response-item.dto";
import { Category } from "../../models/category.model";

export default interface ResponseAssetDto {
  id:number;
  name: string;
  description?: string;
  code: string;
  image_url?: string;
  cost: number;
  category: Category;
  status: number;
  import_date: Date;
  maintenance_due: Date;
  quantity?:number;
}
