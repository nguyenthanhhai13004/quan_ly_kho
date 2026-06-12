import { create } from "zustand";

export interface SelectedAssetRequest {
  id: number;
  code: string;
  name: string;
  quantity: number;
}

interface AdvisorRequestState {
  selectedAssets: SelectedAssetRequest[];
  type: string;
  note: string;
  setType: (type: string) => void;
  setNote: (note: string) => void;
  addSelectedAsset: (asset: any) => void;
  removeSelectedAsset: (index: number) => void;
  updateAssetQuantity: (index: number, quantity: number) => void;
  resetState: () => void;
}

export const useAdvisorRequestStore = create<AdvisorRequestState>((set) => ({
  selectedAssets: [],
  type: "1", // Default: Cấp phát
  note: "",
  setType: (type) => set({ type }),
  setNote: (note) => set({ note }),
  addSelectedAsset: (asset) =>
    set((state) => {
      // Check if already exists
      const exists = state.selectedAssets.find((a) => a.id === asset.id);
      if (exists) return state; // Don't add duplicate
      return {
        selectedAssets: [
          ...state.selectedAssets,
          { id: asset.id, code: asset.code, name: asset.name, quantity: 1 },
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
  resetState: () => set({ selectedAssets: [], type: "1", note: "" }),
}));
