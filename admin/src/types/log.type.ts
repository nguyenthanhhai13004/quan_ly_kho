export interface EditChange  {
  field: string;
  old_value: any;
  new_value: any;
};

export interface LogItem {
  id: number;
  created_at: string;   
  username: string;
  action_id: number;
  controller_id: number;
  ip: string;
  url: string;

  data: Record<string, any> | null; 
  edit_changes: EditChange[]|null;

  action_name: string;
  controller_name: string;
}
