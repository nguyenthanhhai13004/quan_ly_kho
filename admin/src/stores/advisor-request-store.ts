import { create } from "zustand";

export interface SelectedAssetRequest {
  id: number;
  code: string;
  name: string;
  quantity: number;
  allocation_transaction_code?: string;
}

interface AdvisorRequestState {
  selectedAssets: SelectedAssetRequest[];
  type: string;
  note: string;
  classId: string;
  setType: (type: string) => void;
  setNote: (note: string) => void;
  setClassId: (classId: string) => void;
  addSelectedAsset: (asset: any) => void;
  removeSelectedAsset: (index: number) => void;
  updateAssetQuantity: (index: number, quantity: number) => void;
  resetState: () => void;
}

export const useAdvisorRequestStore = create<AdvisorRequestState>((set) => ({
  selectedAssets: [],
  type: "1", // Default: Cấp phát
  note: "",
  classId: "",
  setType: (type) => set({ type, selectedAssets: [] }),
  setNote: (note) => set({ note }),
  setClassId: (classId) => set({ classId }),
  addSelectedAsset: (asset) =>
    set((state) => {
      // Check if already exists
      const exists = state.selectedAssets.find(
        (a) =>
          a.id === asset.id &&
          a.allocation_transaction_code === asset.allocation_transaction_code
      );
      if (exists) return state; // Don't add duplicate
      return {
        selectedAssets: [
          ...state.selectedAssets,
          {
            id: asset.id,
            code: asset.code,
            name: asset.name,
            quantity: asset.quantity ?? 1,
            allocation_transaction_code: asset.allocation_transaction_code,
          },
        ],
      };
    }),
  removeSelectedAsset: (index) =>
    set((state) => ({
      selectedAssets: state.selectedAssets.filter((_, i) => i !== index),
    })),
  updateAssetQuantity: (index, quantity) =>
    set((state) => {
      const newAssets = [...state.selectedAssets];
      newAssets[index].quantity = quantity;
      return { selectedAssets: newAssets };
    }),
  resetState: () => set({ selectedAssets: [], type: "1", note: "", classId: "" }),
}));
