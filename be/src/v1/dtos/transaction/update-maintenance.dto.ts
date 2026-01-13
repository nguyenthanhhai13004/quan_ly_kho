export default interface UpdateMaintenanceDto {
  transaction_code: string;      
  modified_by_user_id: number;
  items: {
    batch_code: string;          
    status: string;              
    next_maintenance_date: string;
  }[];
  completion_date?: string;
}
