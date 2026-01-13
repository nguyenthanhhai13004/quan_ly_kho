// app-store.ts
import { create } from "zustand";

interface AppState {
  openDrawer: boolean;
  setOpenDrawer: (value: boolean) => void;
  toggleDrawer: () => void;
  warehouseSelectedName:string;
  setWarehouseSelectedName:(value: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  openDrawer: false,
  warehouseSelectedName:"",
  setWarehouseSelectedName:(value)=>set(() => ({ warehouseSelectedName: value })),
  setOpenDrawer: (value) => set(() => ({ openDrawer: value })),
  toggleDrawer: () =>
    set((state) => ({ openDrawer: !state.openDrawer })),
}));
