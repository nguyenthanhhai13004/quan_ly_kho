export type TSelectedAsset = {
  id:number;
  code: string;
  name: string;
  batchCode?: string;
  quantity?: number;
  cost?: number;
  manufactureDate?: string;
  maintenanceDue?: string;
  expirationDate?: string;
  newBatch?: boolean;
};
export type TImportManualState = {
  selectedAssets: TSelectedAsset[];
  receivedDate: string;
  senderLocation: string;
  notes?: string;
  reason?: string;
};

export type TImportExcelItem = {
  code: string;
  name: string;
  batchCode?: string;
  quantity?: number;
  cost?: number;
  manufactureDate?: string;
  maintenanceDue?: string;
  expirationDate?: string;
};

export type TExportExcelItem = {
  name: string;
  batchCode?: string;
  quantity?: number;
};

export type TSelectedBatch = {
  name?: string;
  batchCode: string;
  quantity?: number;
};

export type TExportManualState = {
  selectedBatches: TSelectedBatch[];
  exportDate: string;
  receiverName: string;
  receiverPhone:string;
  receiverAddress:string;
  notes?: string;
  reason?: string;
};

export type TDisposalState = {
  selectedBatches: TSelectedBatch[];
  disposalDate: string;
  notes?: string;
  reason?: string;
};

