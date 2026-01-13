export interface CreateTransactionDto {
  code:string;
  name: string;
  warehouse_id:number;
  note?:string;
  reason?:string;
  created_by_user_id:number;
}
