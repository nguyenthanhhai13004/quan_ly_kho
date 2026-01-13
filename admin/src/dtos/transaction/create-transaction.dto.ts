import { z } from "zod";

export const CreateTransactionSchema = z.object({
  name: z.string("Tên đơn là bắt buộc").nonempty("Tên đơn là bắt buộc").max(255, "Độ dài của tên phải < 255 ký tự"),
  code: z.string("Mã đơn là bắt buộc").nonempty("Mã đơn là bắt buộc").max(50, "Độ dài của tên phải < 50 ký tự"),
  note: z.string().max(1000, "Ghi chú không được quá dài").optional(),
  reason: z.string().max(1000, "Lý do không được quá dài").optional(),
});


export interface CreateTransactionDto {
  name: string;
  note?:string;
  reason?:string;
}
