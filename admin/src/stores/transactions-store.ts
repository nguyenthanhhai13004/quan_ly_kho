import { create } from "zustand";
import type {
  TImportManualState,
  TSelectedAssetInput,
  TSelectedBatch,
} from "../types/global";
import generateBatchCode from "../utils/generate-batch-code";

export type TTransactionState = {
  importManualState: TImportManualState;
  batchState: {
    selectedBatches: TSelectedBatch[];
  };
};

export type TTransactionAction = {
  removeSelectedAsset: (rowKey: string) => void;
  addRowImport: (asset: TSelectedAssetInput) => void;
  resetImportManualState: () => void;
  toggleBatch: (batch: TSelectedBatch) => void;
  removeBatch: (batchCode: string) => void;
  resetBatchState: () => void;
};

export const useTransactionStore = create<
  TTransactionState & TTransactionAction
>((set) => ({
  // Luu trang thai form nhap thu cong: danh sach tai san duoc chon va thong tin chung cua phieu nhap.
  importManualState: {
    selectedAssets: [],
    receivedDate: "",
    senderLocation: "",
    notes: "",
    reason: "",
  },
  // Luu danh sach lo dang duoc chon cho cac thao tac theo lo.
  batchState: {
    selectedBatches: [],
  },
  // Chon/bo chon mot lo dua tren batchCode; neu lo da ton tai thi xoa khoi danh sach.
  toggleBatch: ({ name, batchCode, quantity }: TSelectedBatch) =>
    set((state) => {
      const exists = state.batchState.selectedBatches.some(
        (b) => b.batchCode === batchCode,
      );
      return {
        batchState: {
          selectedBatches: exists
            ? state.batchState.selectedBatches.filter(
                (b) => b.batchCode !== batchCode,
              )
            : [
                ...state.batchState.selectedBatches,
                { name, batchCode, quantity },
              ],
        },
      };
    }),

  // Xoa mot lo da chon khoi batchState theo ma lo.
  removeBatch: (batchCode: string) =>
    set((state) => ({
      batchState: {
        selectedBatches: state.batchState.selectedBatches.filter(
          (b) => b.batchCode !== batchCode,
        ),
      },
    })),
  // Dua danh sach lo da chon ve rong.
  resetBatchState: () =>
    set(() => ({
      batchState: {
        selectedBatches: [],
      },
    })),
  // Dat lai form nhap thu cong ve gia tri ban dau.
  resetImportManualState: () =>
    set(() => ({
      importManualState: {
        selectedAssets: [],
        receivedDate: "",
        senderLocation: "",
        notes: "",
        reason: "",
      },
    })),
  // Them tai san vao form nhap; lo moi luon la mot dong rieng, lo cu thi toggle theo ma lo.
  addRowImport: (asset: TSelectedAssetInput) =>
    set((state) => {
      const assetId = asset.id ?? asset.asset_id;
      const assetCode = asset.code ?? asset.asset_code;
      const rawBatchCode = asset.batchCode ?? asset.batch_code;
      const existingBatchCode = rawBatchCode || undefined;
      const isNewBatch = existingBatchCode == undefined;

      if (!assetId || !assetCode) {
        return state;
      }

      const assetName = asset.name ?? asset.asset_name ?? assetCode;

      const exists = state.importManualState.selectedAssets.some(
        (a) =>
          !a.newBatch &&
          a.batchCode === existingBatchCode &&
          existingBatchCode !== undefined,
      );
      if (exists) {
        return {
          importManualState: {
            ...state.importManualState,
            selectedAssets: state.importManualState.selectedAssets.filter(
              (a) => a.batchCode !== existingBatchCode,
            ),
          },
        };
      }

      const selectedBatchCodes = new Set(
        state.importManualState.selectedAssets.map((a) => a.batchCode),
      );
      let batchCode = existingBatchCode;

      if (isNewBatch) {
        do {
          batchCode = generateBatchCode(assetCode);
        } while (selectedBatchCodes.has(batchCode));
      }

      return {
        importManualState: {
          ...state.importManualState,
          selectedAssets: [
            ...state.importManualState.selectedAssets,
            {
              id: assetId,
              code: assetCode,
              name: assetName,
              newBatch: isNewBatch,
              batchCode,
              rowKey: isNewBatch
                ? `new-${assetId}-${batchCode}`
                : `batch-${batchCode}`,
            },
          ],
        },
      };
    }),
  // Xoa dung dong da chon trong form nhap theo rowKey on dinh.
  removeSelectedAsset: (rowKey: string) =>
    set((state) => ({
      importManualState: {
        ...state.importManualState,
        selectedAssets: state.importManualState.selectedAssets.filter(
          (asset) => asset.rowKey !== rowKey,
        ),
      },
    })),
}));
