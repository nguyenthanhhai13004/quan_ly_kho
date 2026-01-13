import { create } from "zustand";
import type {
  TDisposalState,
  TExportManualState,
  TImportManualState,
  TSelectedAsset,
  TSelectedBatch,
} from "../types/global";

export type TTransactionState = {
  importManualState: TImportManualState;
  // exportManualState: TExportManualState;
  // disposalState: TDisposalState;
  batchState: {
    selectedBatches: TSelectedBatch[];
  };
};

export type TTransactionAction = {
  removeSelectedAsset: (index: number) => void;
  newBatchToggle: (index: number) => void;
  updateSelectedAsset: (index: number, field: string, value: any) => void;
  addRowImport: (asset: any) => void;
  // toggleExportManualState: (batch: TSelectedBatch) => void;
  resetImportManualState: () => void;
  // resetExportManualState: () => void;
  toggleBatch: (batch: TSelectedBatch) => void;
  removeBatch: (batchCode: string) => void;
  resetBatchState: () => void;
};

export const useTransactionStore = create<
  TTransactionState & TTransactionAction
>((set) => ({
  importManualState: {
    selectedAssets: [],
    receivedDate: "",
    senderLocation: "",
    notes: "",
    reason: "",
  },
  // exportManualState: {
  //   selectedBatches: [],
  //   exportDate: "",
  //   receiverAddress: "",
  //   receiverName: "",
  //   receiverPhone: "",
  //   notes: "",
  //   reason: "",
  // },
  // disposalState: {
  //   disposalDate: "",
  //   selectedBatches: [],
  //   notes: "",
  //   reason: "",
  // },
  batchState: {
    selectedBatches: [],
  },
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

  removeBatch: (batchCode: string) =>
    set((state) => ({
      batchState: {
        selectedBatches: state.batchState.selectedBatches.filter(
          (b) => b.batchCode !== batchCode,
        ),
      },
    })),
  resetBatchState: () =>
    set(() => ({
      batchState: {
        selectedBatches: [],
      },
    })),
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
  addRowImport: (asset: TSelectedAsset) =>
    set((state) => {
      const exists = state.importManualState.selectedAssets.some(
        (a) => a.batchCode === asset.batchCode && asset.batchCode !== undefined,
      );
      if (exists) {
        return {
          importManualState: {
            ...state.importManualState,
            selectedAssets: state.importManualState.selectedAssets.filter(
              (a) => a.batchCode !== asset.batchCode,
            ),
          },
        };
      }
      return {
        importManualState: {
          ...state.importManualState,
          selectedAssets: [
            ...state.importManualState.selectedAssets,
            {
              id: asset.id,
              code: asset.code,
              name: asset.name,
              newBatch: asset.batchCode == undefined,
              batchCode: asset.batchCode,
            },
          ],
        },
      };
    }),
  removeSelectedAsset: (index: number) =>
    set((state) => ({
      importManualState: {
        ...state.importManualState,
        selectedAssets: state.importManualState.selectedAssets.filter(
          (_, i) => i !== index,
        ),
      },
    })),
  newBatchToggle: (index: number) =>
    set((state) => ({
      importManualState: {
        ...state.importManualState,
        selectedAssets: state.importManualState.selectedAssets.map(
          (asset, i) =>
            i === index ? { ...asset, newBatch: !asset.newBatch } : asset,
        ),
      },
    })),
  updateSelectedAsset: (index: number, field: string, value: any) =>
    set((state) => ({
      importManualState: {
        ...state.importManualState,
        selectedAssets: state.importManualState.selectedAssets.map(
          (asset, i) => (i === index ? { ...asset, [field]: value } : asset),
        ),
      },
    })),

  // toggleExportManualState: ({ name, batchCode, quantity }: TSelectedBatch) =>
  //   set((state) => {
  //     const exists = state.exportManualState.selectedBatches.find(
  //       (b) => b.batchCode === batchCode,
  //     );
  //     if (exists) {
  //       return {
  //         exportManualState: {
  //           ...state.exportManualState,
  //           selectedBatches: state.exportManualState.selectedBatches.filter(
  //             (b) => b.batchCode !== batchCode,
  //           ),
  //         },
  //       };
  //     }
  //     return {
  //       exportManualState: {
  //         ...state.exportManualState,
  //         selectedBatches: [
  //           ...state.exportManualState.selectedBatches,
  //           { name, batchCode, quantity },
  //         ],
  //       },
  //     };
  //   }),
  // resetExportManualState: () =>
  //   set(() => ({
  //     exportManualState: {
  //       exportDate: "",
  //       receiverAddress: "",
  //       receiverName: "",
  //       receiverPhone: "",
  //       selectedBatches: [],
  //       notes: "",
  //       reason: "",
  //     },
  //   })),

  // toggleDisposalState: ({ name, batchCode, quantity }: TSelectedBatch) =>
  //   set((state) => {
  //     const exists = state.disposalState.selectedBatches.find(
  //       (b) => b.batchCode === batchCode,
  //     );
  //     if (exists) {
  //       return {
  //         disposalState: {
  //           ...state.disposalState,
  //           selectedBatches: state.disposalState.selectedBatches.filter(
  //             (b) => b.batchCode !== batchCode,
  //           ),
  //         },
  //       };
  //     }
  //     return {
  //       disposalState: {
  //         ...state.disposalState,
  //         selectedBatches: [
  //           ...state.disposalState.selectedBatches,
  //           { name, batchCode, quantity },
  //         ],
  //       },
  //     };
  //   }),
  // resetDisposalState: () =>
  //   set(() => ({
  //     disposalState: {
  //       disposalDate: "",
  //       selectedBatches: [],
  //       notes: "",
  //       reason: "",
  //     },
  //   })),
}));
